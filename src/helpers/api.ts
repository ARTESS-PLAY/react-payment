
import {log} from "util";

// @ts-ignore
window.env = window.env || {
    REACT_APP_API_URL: "http://127.0.0.1:8002/api",
    REACT_APP_API_ENDPOINT_GET_PAYMENT_INFO: "/order/payment-info",
    REACT_APP_API_ENDPOINT_CHECK_ORDER_STATUS: "/order/:order_number/check-status",
    REACT_APP_API_ENDPOINT_WAIT_FOR_LINK: "/order/wait-link",
    REACT_APP_APPROVE_PAYMENT_URL: "http://localhost:8000/approve",
}

export interface IPaymentInfo {
    wait_for_link: boolean
    order_timestamp: number
    card_number?: string
    amount: number
}
export interface IResponseOrderDto {
    success: boolean
    error?: string
    order_number?: string
    info: IPaymentInfo
}

interface IProcessOrderDto {
    order_number: string
}
export const processOrder = ({order_number}: IProcessOrderDto): Promise<IResponseOrderDto|null> => {
    return new Promise(resolve => {
        // @ts-ignore
        fetch(api_url(api_routes.get_payment_info) + "?order_number=" + order_number)
            .then(res => res.json())
            .then((res: IResponseOrderDto|null) => resolve(res))
            .catch(() => resolve(null))
    })
}

export enum WaitLinkStatus {
    Disabled,
    Pending,
    Success,
    Error,
}
export interface WaitLinkStage {
    status: WaitLinkStatus
    message?: string
}
export interface WaitLinkInformer {
    link: () => WaitLinkStage
    payment: () => WaitLinkStage
    getPaymentLink: () => string
    onUpdate: (callback: () => void) => void
    onStartPayment: () => void
}
export const processLink = (order: IResponseOrderDto): WaitLinkInformer|false => {
    if(!order?.info.wait_for_link){
        return false
    }

    let linkStatus: WaitLinkStage = {
        status: WaitLinkStatus.Pending,
        message: "Создание ссылки на оплату...",
    }
    let paymentStatus: WaitLinkStage = {
        status: WaitLinkStatus.Disabled
    }
    let paymentLink = ""
    let onUpdate: () => void = () => {}
    let onStartPayment: () => void = () => {}

    setTimeout(() => {
        try{
            const ev = new EventSource( api_url(api_routes.wait_for_link)+ '?order_number=' + order.order_number)
            ev.onmessage = (event) => {
                try{
                    const res = JSON.parse(event.data)
                    if(res.link) {
                        // location.href = res.link
                        paymentLink = res.link
                        linkStatus.status = WaitLinkStatus.Success
                        linkStatus.message = "Ссылка сгенерирована!"
                        onUpdate()

                        // start checking payment
                        onStartPayment = () => {
                            checkOrderStatus(order, paymentStatus, onUpdate)
                            onStartPayment = () => {}
                        }
                    }else{
                        throw new Error("Не удалось создать ссылку")
                    }
                    ev.close()
                }catch(e){
                    console.log(e)
                    linkStatus.status = WaitLinkStatus.Error
                    linkStatus.message = "Ошибка при получении ссылки на оплату"
                    onUpdate()
                    ev.close()
                }
            }
            onUpdate()
        }catch (e) {
            linkStatus.status = WaitLinkStatus.Error
            linkStatus.message = "Ошибка при создании ссылки на оплату"
            onUpdate()
        }
    }, 2000)

    console.log('new informer created')
    return {
        link: () => linkStatus,
        payment: () => paymentStatus,
        getPaymentLink: () => paymentLink,
        onUpdate: (callback) => onUpdate = callback,
        onStartPayment: () => onStartPayment(),
    }
}

enum OrderStatuses {
    New = 'new',
    Pending = 'pending',
    Completed = 'completed',
    Failed = 'failed',
}
interface IOrderStatusDto {
    success: boolean
    // error?: string
    order_status?: string
}
const checkOrderTimeout = 10 * 60 * 1000 // 10min
const checkOrderInterval = 10 * 1000 // 10sec
const checkOrderStatus = (order: IResponseOrderDto, payment: WaitLinkStage, onUpdate: () => void) => {
    let isActual = true
    let interval: any = null
    setTimeout(() => isActual = false, checkOrderTimeout + checkOrderInterval)

    payment.status = WaitLinkStatus.Pending
    payment.message = 'Ожидание подтверждения'
    onUpdate()

    const main = () => {
        if(!isActual){
            clearInterval(interval)
            payment.status = WaitLinkStatus.Error
            payment.message = 'Время ответа от сервера превышено'
            onUpdate()
            return
        }

        // @ts-ignore
        fetch(api_url(api_routes.check_status.replace(':order_number', order.order_number)))
            .then(res => res.json())
            .then((res: IOrderStatusDto) => {
                if(res.success && res.order_status){
                    const status = res.order_status
                    if(status === OrderStatuses.New || status === OrderStatuses.Pending){
                        payment.status = WaitLinkStatus.Pending
                        payment.message = 'Ожидание подтверждения'
                        onUpdate()
                    }else if(status === OrderStatuses.Failed){
                        payment.status = WaitLinkStatus.Error
                        payment.message = 'При обработке оплаты произошла ошибка'
                        onUpdate()
                        isActual = false
                    }else if(status === OrderStatuses.Completed){
                        payment.status = WaitLinkStatus.Success
                        payment.message = 'Оплата успешно прошла!'
                        onUpdate()
                        isActual = false
                    }
                }

            })
    } // end main()

    interval = setInterval(main, checkOrderInterval) // every 10sec
}

export const uploadFile = (file: File, order_number: string) => {
    const formData = new FormData()
    formData.append('approve', file)

    return new Promise(resolve => {
        const timeout = setTimeout(() => resolve(false), 20000)
        fetch(api_routes.approve + '?order_number=' + order_number, {
            method: "POST",
            body: formData,
        })
            .then(res => res.json())
            .then(res => {
                resolve(res.success)
            })
            .catch(err => resolve(false))
    })
}

const api_url = (path: string|undefined): string|null => {
    if(!path) {
        return null
    }
    if(path.indexOf('http') === 0){
        return path
    }
    //@ts-ignore
    return window.env.REACT_APP_API_URL + path
}

export const api_routes = {
    //@ts-ignore
    get_payment_info: window.env.REACT_APP_API_ENDPOINT_GET_PAYMENT_INFO,
    //@ts-ignore
    check_status: window.env.REACT_APP_API_ENDPOINT_CHECK_ORDER_STATUS,
    //@ts-ignore
    wait_for_link: window.env.REACT_APP_API_ENDPOINT_WAIT_FOR_LINK,
    //@ts-ignore
    approve: window.env.REACT_APP_APPROVE_PAYMENT_URL,
}

export const payment_methods = {
    bank_transfer: "Перевод на карту",
    visa: "Kapital Bank Visa",
    mastercard: "Kapital Bank Mastercard",
}
