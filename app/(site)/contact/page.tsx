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
                    <div>
                        <h3 className="text-xl font-semibold">Социальные сети</h3>
                        <p className="text-gray-700">
                            <a href="https://vk.com/roboflovers" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                vk.com
                            </a>
                        </p>
                    </div>
                </div>
                <div className="mt-6">
                    <iframe
                        src="https://yandex.ru/map-widget/v1/?ll=30.335451%2C59.923365&source=serp_navig&z=12.38"
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
