export type AuctionStatus = "draft" | "active" | "ended";

export interface AuctionDTO {
  id: string;
  vehicleId: string;
  title: string;
  startingPrice: number;
  currentPrice: number;
  status: AuctionStatus;
  startAt: string;
  endAt: string;
}