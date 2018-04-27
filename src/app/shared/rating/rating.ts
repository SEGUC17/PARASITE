export interface UserRating {
    ratedId: string;
    rating: number;
    type: 'content' | 'studyPlan' | 'seller';
    username?: string;
}
