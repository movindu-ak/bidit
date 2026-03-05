export interface Auction {
  id: string;
  title: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  startTime: Date;
  endTime: Date;
  sellerId: string;
  imageUrl?: string;
  status: 'active' | 'ended' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAuctionData {
  title: string;
  description: string;
  startingPrice: number;
  startTime: Date;
  endTime: Date;
  imageUrl?: string;
}

export interface AuctionFilters {
  status?: 'active' | 'ended' | 'cancelled';
  minPrice?: number;
  maxPrice?: number;
  sellerId?: string;
}
