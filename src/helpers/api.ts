
// @ts-ignore
window.env = window.env || {
    REACT_APP_API_URL: "http://127.0.0.1:8002/api",
    REACT_APP_API_ENDPOINT_CREATE_ORDER: "/order/create",
    REACT_APP_API_ENDPOINT_CHECK_ORDER_STATUS: "/order/:order_number/check-status",
    REACT_APP_API_ENDPOINT_WAIT_FOR_LINK: "/order/wait-link",
}

export interface IResponseOrderDto {
    success: boolean
    message?: string
    error?: string
    order_number?: string
    card?: string
    order_timestamp?: number
    wait_for_link?: boolean
}

interface ICreateOrderDto {
    shop_public_key: string
    amount: number
    payment_method: string
    payload: string
}
export const createOrder = (dto: ICreateOrderDto): Promise<IResponseOrderDto|null> => {
    return new Promise(resolve => {
        // @ts-ignore
        fetch(api_url(api_routes.create_order), {
            method: "POST",
            body: JSON.stringify(dto),
        })
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
    if(!order?.wait_for_link){
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
    })

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
const checkOrderTimeout = 12 * 60 * 1000 // 12min
const checkOrderStatus = (order: IResponseOrderDto, payment: WaitLinkStage, onUpdate: () => void) => {
    let isActual = true
    let interval: any = null
    setTimeout(() => isActual = false, checkOrderTimeout) // 12min

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

    interval = setInterval(main, 10000) // every 10sec
}

const api_url = (path: string|undefined): string|null => {
    if(!path) {
        return null
    }
    //@ts-ignore
    return window.env.REACT_APP_API_URL + path
}

export const api_routes = {
    //@ts-ignore
    create_order: window.env.REACT_APP_API_ENDPOINT_CREATE_ORDER,
    //@ts-ignore
    check_status: window.env.REACT_APP_API_ENDPOINT_CHECK_ORDER_STATUS,
    //@ts-ignore
    wait_for_link: window.env.REACT_APP_API_ENDPOINT_WAIT_FOR_LINK,
}

export const payment_methods = {
    bank_transfer: "Перевод на карту",
    visa: "Kapital Bank Visa",
    mastercard: "Kapital Bank Mastercard",
}
