exports.isString = (str) => {
    return typeof str == 'string' ? true : false
}

exports.isStringnotEmpty = (str) => {
    return typeof str == 'string' && str !== '' ? true : false
}

exports.isObjectId = (str) => {
    return __mongoose.Types.ObjectId.isValid(str) ? true : false
}

exports.isNumber = (num) => {
    return typeof num == 'number' && !isNaN(num) ? true : false
}

exports.isBoolean = (boo) => {
    return typeof boo == 'boolean' ? true : false
}

exports.isArray = (arr) => {
    return Array.isArray(arr) ? true : false
}

exports.isObject = (obj) => {
    return typeof obj == 'object' && obj && Object.keys(obj).length > 0 && !this.isArray(obj) ? true : false
}

exports.isFunction = (func) => {
    return typeof func == 'function' ? true : false
}

exports.checkReq = (verify, data) => {
    if (!this.isObject(verify)) verify = {}
    if (!this.isObject(data)) data = {}

    let wrong = {}
    let right = {}

    for (let i in verify) {
        if (this.isObject(verify[i])) {
            switch (verify[i].type) {
                case String:
                    if (this.isString(data[i])) {
                        if (data[i].trim() == '' && verify[i].required == true) wrong[i] = 'is empty'
                        else right[i] = data[i]
                    }
                    else if (verify[i].required == true) wrong[i] = 'is required string'
                    break
                case Number:
                    if (this.isNumber(data[i])) right[i] = data[i]
                    else if (verify[i].required == true) wrong[i] = 'is required number'
                    break
                case Boolean:
                    if (this.isBoolean(data[i])) right[i] = data[i]
                    else if (verify[i].required == true) wrong[i] = 'is required boolean'
                    break
                case Array:
                    if (this.isArray(data[i])) {
                        if (!data[i].length && verify[i].required == true) wrong[i] = 'is empty'
                        else if (verify[i].typeChild) {
                            data[i].forEach((item, idx) => {
                                switch (verify[i].typeChild) {
                                    case String:
                                        if (this.isString(item)) {
                                            if (!this.isArray(right[i])) right[i] = []
                                            right[i].push(item)
                                        }
                                        else if (verify[i].required == true) {
                                            if (!this.isArray(wrong[i])) wrong[i] = []
                                            wrong[i].push(`${idx}: is required string`)
                                        }
                                        break
                                    case Number:
                                        if (this.isNumber(item)) {
                                            if (!this.isArray(right[i])) right[i] = []
                                            right[i].push(item)
                                        }
                                        else if (verify[i].required == true) {
                                            if (!this.isArray(wrong[i])) wrong[i] = []
                                            wrong[i].push(`${idx}: is required number`)
                                        }
                                        break
                                    case Boolean:
                                        if (this.isBoolean(item)) {
                                            if (!this.isArray(right[i])) right[i] = []
                                            right[i].push(item)
                                        }
                                        else if (verify[i].required == true) {
                                            if (!this.isArray(wrong[i])) wrong[i] = []
                                            wrong[i].push(`${idx}: is required boolean`)
                                        }
                                        break
                                    case Array:
                                        if (this.isArray(item)) {
                                            if (!this.isArray(right[i])) right[i] = []
                                            right[i].push(item)
                                        }
                                        else if (verify[i].required == true) {
                                            if (!this.isArray(wrong[i])) wrong[i] = []
                                            wrong[i].push(`${idx}: is required array`)
                                        }
                                        break
                                    case Object:
                                        if (this.isObject(item)) {
                                            if (this.isObject(verify[i].object)) {
                                                let out = this.validation(verify[i].object, item)

                                                if (!this.isArray(right[i])) right[i] = []
                                                right[i].push(out.right)

                                                if (this.isObject(out.wrong) && verify[i].required == true) {
                                                    if (!this.isArray(wrong[i])) wrong[i] = []
                                                    let temp = {}
                                                    temp[idx] = out.wrong
                                                    wrong[i].push(temp)
                                                }
                                            }
                                            else {
                                                if (!this.isArray(right[i])) right[i] = []
                                                right[i].push(item)
                                            }
                                        }
                                        else if (verify[i].required == true) {
                                            if (!this.isArray(wrong[i])) wrong[i] = []
                                            wrong[i].push(`${idx}: is required object`)
                                        }
                                        break
                                }
                            })
                        }
                        else right[i] = data[i]
                    }
                    else if (verify[i].required == true) wrong[i] = 'is required array'
                    break
                case Object:
                    if (this.isObject(data[i])) {
                        if (this.isObject(verify[i].object)) {
                            let out = this.validation(verify[i].object, data[i])
                            right[i] = out.right

                            if (this.isObject(out.wrong) && verify[i].required == true) wrong[i] = out.wrong
                        }
                        else right[i] = data[i]
                    }
                    else if (verify[i].required == true) wrong[i] = 'is required object'
                    break
            }
        }
    }

    return { wrong, right }
}