export interface UserRating {
    ratedId: string;
    rating: number;
    type: 'content' | 'studyPlan' | 'product';
    username?: string;
}
