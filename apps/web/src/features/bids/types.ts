export interface Bid {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  timestamp: Date;
  status: 'active' | 'outbid' | 'won';
}

export interface CreateBidData {
  auctionId: string;
  amount: number;
}

export interface BidHistory {
  bids: Bid[];
  totalBids: number;
  highestBid?: Bid;
}
