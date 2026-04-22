const page = () => {
  return (
    <div className="">
      <div className="[&>div]:flex [&>div]:p-4 [&>div]:gap-5 [&>div]:border-b">
        <div>
          販売事業者名: <div> meme-legends</div>
        </div>
        <div>
          代表者名: <div>伊藤 ジョナタン</div>{" "}
        </div>
        <div>
          所在地: <div>ご請求があれば遅滞なく開示いたします</div>
        </div>
        <div>
          お問い合わせ先: <div>E-mail: jhonatan-ito@hotmail.com </div>
        </div>
        <div>
          電話番号:
          <div>070-3965-8345</div>
        </div>
        <div>
          販売価格: <div>各商品ページに表示された価格に基づきます。</div>
        </div>
        <div>
          商品代金以外の必要料金:{" "}
          <div>送料が別途発生する場合があります。</div>{" "}
        </div>
        <div>
          支払い方法: <div>クレジットカード決済（Stripe）</div>
        </div>
        <div>
          支払い時期:
          <div>ご注文時にお支払いが確定します。 </div>
        </div>
        <div>
          商品の引き渡し時期:{" "}
          <div>
            ご注文確定後、通常5〜10営業日以内に発送いたします。配送には地域によりさらに数日かかる場合があります。
          </div>
        </div>
        <div>
          返品・キャンセルについて:
          <div>
            商品は受注生産のため、お客様都合による返品・交換はお受けしておりません。
            不良品や印刷ミスなどの不備があった場合は、商品到着後7日以内にご連絡ください。交換または返金対応をいたします。
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
