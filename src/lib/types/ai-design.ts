export interface AiCakeDesign {
  _id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  createdAt: string;
}

export interface AiCakeDesignHistory {
  designs: AiCakeDesign[];
  remaining: number;
  dailyLimit: number;
}
