import request from 'superagent';

export function post (url, data) {
    return new Promise((resolve) => {
        const req = request
        .post(url)
        .set({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })
        .send(data);

        req.end((error, res) => {
            if (error) {
                console.error('recv error[' + url + ']:', error);
                resolve();
            } else {
                console.log('recv[' + url + ']:', res.body);
                resolve(res.body);
            }
        });
    });
}
