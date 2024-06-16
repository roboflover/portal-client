import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact',
}

export default function ContactPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-2xl p-8 space-y-6 rounded shadow-md">
                <h2 className="text-3xl font-bold text-center">Контакты</h2>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-xl font-semibold">Почта</h3>
                        <p className="text-gray-700">portal@robobug.ru</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Телефон</h3>
                        <p className="text-gray-700">+79032888286</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold">Адрес</h3>
                        <p className="text-gray-700">Санкт-Петербург, Среднерогатская улица, дом 8к1</p>
                    </div>
                </div>
                <div className="mt-6">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1994.769938018657!2d30.31757831599471!3d59.93428008187527!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469631b4a7e6b9e9%3A0x8c5e6a2b1f8a7c9d!2z0JrRg9C60LDRgNC40YLRjCDQnNCw0YHQutCy0LAsIDjQkDEsINCe0LzRgdC60LLQsCwg0KDQtdGB0L_QvtC70YzRgdC60LDRjyDQvtCx0LsuLCAxOTExMTk!5e0!3m2!1sru!2sru!4v1635943026625!5m2!1sru!2sru"
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </div>
    );
}
