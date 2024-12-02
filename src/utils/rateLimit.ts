const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class RateLimiter {
  private queue: Array<{
    request: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
    priority: boolean;
    retries: number;
  }> = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private readonly minDelay: number;
  private readonly maxRetries = 3;
  private readonly baseDelay = 1000;

  constructor(requestsPerSecond: number) {
    this.minDelay = Math.ceil(1000 / requestsPerSecond);
  }

  async add<T>(request: () => Promise<T>, priority = false): Promise<T> {
    return new Promise((resolve, reject) => {
      const queueItem = {
        request,
        resolve,
        reject,
        priority,
        retries: 0,
      };

      if (priority) {
        const lastPriorityIndex = this.queue.findLastIndex(item => item.priority);
        if (lastPriorityIndex >= 0) {
          this.queue.splice(lastPriorityIndex + 1, 0, queueItem);
        } else {
          this.queue.unshift(queueItem);
        }
      } else {
        this.queue.push(queueItem);
      }

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;
    const item = this.queue.shift();
    
    if (item) {
      try {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.minDelay) {
          await delay(this.minDelay - timeSinceLastRequest + 100);
        }

        this.lastRequestTime = Date.now();
        const result = await item.request();
        item.resolve(result);
      } catch (error) {
        if (
          error &&
          typeof error === 'object' &&
          'statusCode' in error &&
          error.statusCode === 429 &&
          item.retries < this.maxRetries
        ) {
          item.retries++;
          const backoffDelay = Math.min(
            this.baseDelay * Math.pow(2, item.retries),
            8000
          );
          await delay(backoffDelay);
          
          if (item.priority) {
            this.queue.unshift(item);
          } else {
            this.queue.push(item);
          }
        } else {
          item.reject(error);
        }
      }

      await delay(100);
      this.processQueue();
    }
  }
}