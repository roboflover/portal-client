// pages/catalog.tsx

'use client'
import { getProducts, updateProduct, deleteProduct, Product } from '@/app/lib/productApi'
import { useEffect, useState } from 'react';

export default function Catalog() {
    const [products, setЗroducts] = useState<Product[]>([]);

    return (

    <div className="max-w-4xl mx-auto p-6 mb-14">
      <h1 className="text-2xl font-bold mb-4">Пользовательское соглашение онлайн сервиса 3D печати с доставкой</h1>
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">1. Общие положения</h2>
        <p className="mb-2">1.1. Настоящее Пользовательское соглашение (далее - Соглашение) регулирует отношения между пользователем (далее - Пользователь) и онлайн сервисом 3D печати с доставкой (далее - Сервис).</p>
        <p>1.2. Пользователь обязан ознакомиться с условиями Соглашения перед использованием Сервиса. Использование Сервиса означает согласие Пользователя с условиями Соглашения.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">2. Услуги</h2>
        <p className="mb-2">2.1. Сервис предоставляет услуги по 3D печати и доставке готовых изделий.</p>
        <p>2.2. Все заказы обрабатываются и выполняются в порядке очереди, в зависимости от загрузки 3D принтеров.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">3. Качество и точность печати</h2>
        <p className="mb-2">3.1. FMD печать может подразумевать незначительные погрешности в диапазоне 1-2 мм.</p>
        <p>3.2. Пользователь осознает и принимает возможные отклонения в размерах и форме готового изделия.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">4. Цветовая палитра</h2>
        <p className="mb-2">4.1. Цветовая палитра подбирается более детально, чем на сайте, при заказе на сумму от 5000 рублей.</p>
        <p>4.2. В случае заказа на сумму менее 5000 рублей, цвет готового изделия может незначительно отличаться от представленного на сайте.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">5. Сроки выполнения заказов</h2>
        <p className="mb-2">5.1. В зависимости от загрузки наших 3D принтеров, скорость печати и выполнение заказа составляет от 5 до 7 дней.</p>
        <p>5.2. В исключительных случаях сроки могут быть увеличены, о чем Пользователь будет уведомлен заранее.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">6. Возврат и обмен</h2>
        <p className="mb-2">6.1. Детали, изготовленные по индивидуальному заказу, возврату и обмену не подлежат.</p>
        <p>6.2. В случае обнаружения брака или несоответствия заказа, Пользователь обязан связаться с поддержкой Сервиса для разрешения ситуации.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">7. Оплата</h2>
        <p className="mb-2">7.1. Оплата услуг осуществляется через доступные на сайте способы.</p>
        <p>7.2. Заказ считается принятым к исполнению после поступления оплаты на счет Сервиса.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">8. Конфиденциальность</h2>
        <p className="mb-2">8.1. Сервис обязуется не разглашать личные данные Пользователя третьим лицам без его согласия.</p>
        <p>8.2. Личные данные используются исключительно для обработки заказов и улучшения качества обслуживания.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">9. Ответственность сторон</h2>
        <p className="mb-2">9.1. Сервис не несет ответственности за неправильное использование готовых изделий Пользователем.</p>
        <p>9.2. Пользователь несет ответственность за предоставление точных данных для выполнения заказа.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">10. Изменения в соглашении</h2>
        <p className="mb-2">10.1. Сервис оставляет за собой право вносить изменения в настоящее Соглашение в одностороннем порядке.</p>
        <p>10.2. Об изменениях Пользователь будет уведомлен путем размещения новой редакции Соглашения на сайте.</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">11. Заключительные положения</h2>
        <p className="mb-2">11.1. Настоящее Соглашение вступает в силу с момента его акцепта Пользователем.</p>
        <p>11.2. Все споры и разногласия, возникающие в связи с выполнением настоящего Соглашения, решаются путем переговоров между сторонами.</p>
      </div>

      <p>Используя услуги нашего Сервиса, вы подтверждаете свое согласие с условиями настоящего Пользовательского соглашения и обязуетесь их соблюдать.</p>

    </div>

    )
}
