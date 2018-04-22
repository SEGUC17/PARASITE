// TODO create the category class
import { Section } from './section';
export interface Category {
    _id?: string;
    name: string;
    iconLink?: string;
    sections?: Section[];

}
