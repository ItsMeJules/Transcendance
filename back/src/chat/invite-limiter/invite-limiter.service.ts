import { Injectable } from '@nestjs/common';

type RateLimitInfo = {
  timeUntilNextIncomingInvite: number;
  timeUntilNextOutgoingInvite: number;
};

@Injectable()
export class InviteLimiterService {
  private rateLimitMap = new Map<number, RateLimitInfo>();

  getRateLimit(userId: number): RateLimitInfo {
    let rateLimit = this.rateLimitMap.get(userId);

    if (!rateLimit) {
      rateLimit = {
        timeUntilNextIncomingInvite: 0,
        timeUntilNextOutgoingInvite: 0,
      };
      this.rateLimitMap.set(userId, rateLimit);
    }

    return rateLimit;
  }

  updateRateLimit(userId: number, updatedInfo: RateLimitInfo): void {
    this.rateLimitMap.set(userId, updatedInfo);
  }

  removeRateLimit(userId: number): void {
    this.rateLimitMap.delete(userId);
  }
}
