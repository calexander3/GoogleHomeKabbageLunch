import * as https from 'https';
import * as Url from 'url';
import { RequestOptions } from "http";

export class ApiRequestService{
    public getContent<T>(url: Url.Url, authorization?: string): Promise<T> {
        return new Promise((resolve:any, reject:any) => {
            let opts: RequestOptions = {
                host: url.hostname,
                port: parseInt(url.port || '443'),
                path: url.path,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            if (authorization) {
                opts.headers['Authorization'] = `bearer ${authorization}`
            }
            const request = https.get(opts, (response: any) => {
            const body: string[] = [];
            response.on('data', (chunk: string) => body.push(chunk));
            response.on('end', () =>{ 
                    var responseString = body.join('');
                    if (response.statusCode < 200 || response.statusCode > 299) {
                        console.error(`${response.statusCode} - ${url.href} - ${responseString}`)
                        reject();
                    }
                    resolve(JSON.parse(responseString));
                });
            });
            request.on('error', (err: any) => {
                console.error(err);
                reject(err);
            });
        });
    }

    public postContent<T,Y>(url: Url.Url, postData?: T, authorization?: string): Promise<Y> {
        return new Promise((resolve:any, reject:any) => {
            let postDataString = postData ? JSON.stringify(postData) : null;
            let opts: RequestOptions = {
                host: url.hostname,
                port: parseInt(url.port || '443'),
                path: url.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            if (authorization) {
                opts.headers['Authorization'] = `bearer ${authorization}`
            }
            if (postDataString) {
                opts.headers['Content-Length'] = Buffer.byteLength(postDataString)
            }
            const request = https.request(opts, (response: any) => {
                const body: string[] = [];
                response.on('data', (chunk: string) => body.push(chunk));
                response.on('end', () =>{ 
                    var responseString = body.join('');
                    if (response.statusCode < 200 || response.statusCode > 299) {
                        console.error(response.statusCode + ' - ' + responseString)
                        reject();
                    }
                    resolve(JSON.parse(responseString));
                });
            });
            request.on('error', (err: any) => reject(err));
            if (postDataString) {
                request.write(postDataString)
            };
            request.end();
        });
    }
}