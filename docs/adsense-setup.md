# AdSense Kurulum Rehberi

## Adım 1 — Global script (BaseLayout.astro)

`src/layouts/BaseLayout.astro` dosyasında `<!-- ADSENSE_SCRIPT_PLACEHOLDER -->` satırını
Google'dan aldığın script ile değiştir:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
```

## Adım 2 — Ad unit ID'leri (AdSlot.astro)

`src/components/ui/AdSlot.astro` dosyasında şu iki alanı doldur:

```ts
const ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX'; // Google'dan gelen publisher ID
const ADSENSE_SLOTS = {
  'after-result':  'XXXXXXXXXX', // calculator sonucu altı — en yüksek intent
  'in-content':    'XXXXXXXXXX', // rehber içeriği ortası
  'sidebar':       'XXXXXXXXXX', // yan panel (masaüstü)
  'footer-banner': 'XXXXXXXXXX', // footer üstü
  'header-banner': 'XXXXXXXXXX', // header altı
};
```

## Reklam Yerleşim Haritası

### Calculator sayfaları (yüksek intent — öncelikli)
```
[HEADER]
[Hesap formu]
[SONUÇ KUTUSU]
[AdSlot: after-result]   ← kullanıcı sonucu gördükten hemen sonra
[Hesap dökümü]
[AdSlot: in-content]     ← içerik ortası
["How to measure" bölümü]
[İlgili calculator linkleri]
[AdSlot: footer-banner]  ← sayfa sonu
[FOOTER]
```

### Guide / reference sayfaları
```
[HEADER]
[Başlık + giriş]
[AdSlot: header-banner]  ← içerik başı
[Makale içeriği]
[AdSlot: in-content]     ← içerik ortası
[Makale sonu]
[AdSlot: footer-banner]  ← sayfa sonu
[İlgili sayfalar]
[FOOTER]
```

## Notlar
- `after-result` slot'u en değerli konumdur — kullanıcı satın alma kararı verdiği anda görür.
- AdSense otomatik reklam (Auto ads) açıksa `in-content` slot'larını devre dışı bırakabilirsin.
- AdSense onayı için sitede en az 3-5 gerçek içerik sayfası olmalı (calculator + guide yeterli).
