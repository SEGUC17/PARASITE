import { Injectable } from '@angular/core';


@Injectable()
export class AdminService {

    test(): any {
    let x = 'in service';
    return x;
    }
}
