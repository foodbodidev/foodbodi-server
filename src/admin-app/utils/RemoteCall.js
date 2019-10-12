class RemoteCall {
    constructor(url) {
        this.headers = {
            token : window.foodbodi_token
        };
        this.body = {};
        this.responseCb = null;
        this.jsonResponseCb = null;
        this.onErrorCb = null;
        this.url = url
    }

    usePOST() {
        this.method = "POST"
        return this;
    }

    useGET() {
        this.method = "GET"
        return this;
    }

    usePUT() {
        this.method = "PUT"
        return this;
    }

    useDELETE() {
        this.method = "DELETE"
        return this;
    }

    useJson() {
        this.headers["Accept"] = 'application/json';
        this.headers["Content-Type"] = 'application/json';
        this.json = true;
        return this;
    }

    header(key, value) {
        this.headers[key] = value
        return this;
    }

    setBody(payload) {
        if (!!payload) {
            this.body = payload
        }
        return this;
    }

    onResponse(cb) {
        this.responseCb = cb;
        return this;
    }

    onJsonResponse(cb) {
        this.jsonResponseCb = cb;
        return this;
    }

    onError(cb) {
        this.onErrorCb = cb;
        return this;
    }

    setUrl(url) {
        this.url = url
    }

    execute() {
        let option = {
            method: this.method,
            headers: this.headers
        };
        if (this.method !== "GET" && this.method !== "HEAD" ) {
            option.body = this.json ? JSON.stringify(this.body) : this.body
        }
        if (this.json) {
            fetch(this.url, option).then(res => res.json())
                .then(json => {
                    if (this.jsonResponseCb !== null) {
                        this.jsonResponseCb(json)
                    }
                }).catch(error => {
                if (this.onErrorCb !== null) {
                    this.onErrorCb(error)
                }
            })
        } else {
            fetch(this.url,option).then(res => {
                    if (this.responseCb !== null) {
                        this.responseCb(res)
                    }
                }).catch(error => {
                if (this.onErrorCb !== null) {
                    this.onErrorCb(error)
                }
            });
        }
    }

    static setApiToken(token) {
        window.foodbodi_token = token
    }
}

export default RemoteCall