
interface translate {
    payment: string
    transaction_id: string
    transaction_is_processing: string
    balance_will_increase_after_transaction: string
    return_to_shop: string
    i_have_paid: string
    continue: string
    time_remain: string
    amount: string
    check_card_number: string
    card_number: string
    copied: string
    confirmation: string
    rules: string
    rules_text: string
    upload_file: string
}

const params = new URLSearchParams(window.location.search)
const lang = params.get('lang') ?? ''

// @ts-ignore
const texts: translate = (lang.toLowerCase() === 'ru') ? {
    payment: 'Оплата',
    transaction_id: 'ID транзакции',
    transaction_is_processing: 'Транзакция обрабатывается',
    balance_will_increase_after_transaction: 'Ваш баланс пополнится автоматически по окончании транзакции',
    return_to_shop: 'Вернуться в магазин',
    i_have_paid: 'Оплатил',
    continue: 'Далее',
    time_remain: 'Время заявки',
    amount: 'Сумма',
    check_card_number: 'Не забывайте проверять номер карты',
    card_number: 'Адрес',
    copied: 'Скопировано!',
    confirmation: 'Подтверждение перевода',
    rules: 'Правила',
    rules_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ' +
        'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ' +
        'Tellus id interdum velit laoreet id donec ultrices tincidunt. ' +
        'Tempor orci eu lobortis elementum nibh. Quis eleifend quam adipiscing vitae proin sagittis nisl. ' +
        'Ac turpis egestas maecenas pharetra convallis posuere morbi leo urna.',
    upload_file: 'Загрузить файл',
} : {
    payment: 'Ödəniş',
    transaction_id: 'Transaction ID',
    transaction_is_processing: 'Sorğunuza baxılır',
    balance_will_increase_after_transaction: 'Sorğunuza baxıldıqdan sonra ödənişiniz balansınıza yüklənəcək',
    return_to_shop: 'Sayta qayıt',
    i_have_paid: 'Ödənilmişdir',
    continue: 'Sonrakı',
    time_remain: 'Sorğu müddəti',
    amount: 'məbləğ',
    check_card_number: 'Qeyd olunan kart nömrəsinə diqqət edin',
    card_number: 'kartı nömrəsi',
    copied: 'Kopyalandı!',
    confirmation: 'Qəbzi yükləyin',
    rules: 'Qaydalar',
    rules_text: 'Pulu göndərmək üçün sizin 10 dəq vaxdınız var,qeyd olunan ' +
        'kart nömrəsinə diqqət edin və qəbzi yükləyin sonra “ödənilmişdir” sözünə basın. Hər hansı problem yaşanarsan dəstək xidmətinə yazın.',
    upload_file: 'Qəbz yükləmək üçün yer',
}

export const __ = (text: string): string => {
    if(text in texts){
        // @ts-ignore
        return texts[text]
    }
    return ''
}

export const Translate = texts