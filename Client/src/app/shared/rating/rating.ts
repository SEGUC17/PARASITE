export interface UserRating {
    ratedID: string;
    rating: number;
    type: 'content' | 'studyPlan' | 'product';
    username?: string;
}
