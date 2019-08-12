import { Injectable } from '@angular/core';

@Injectable()
export class AppGlobal {
    readonly baseAppUrl: string = 'http://198.58.116.113';
    readonly basePort: string = ':5000';
    readonly baseAPIUrl: string = 'https://api.github.com/';
}