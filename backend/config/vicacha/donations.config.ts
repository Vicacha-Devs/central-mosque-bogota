type EnvFn = {
  (key: string, defaultValue?: any): any;
  int(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
};

export function buildMosqueDonationsPluginConfig(env: EnvFn) {
  return {
    enabled: true,
    config: {
      defaultLocale: 'es',
      supportedLocales: ['es', 'en', 'ar', 'tr'],
      baseCurrency: 'COP',
      supportedCurrencies: ['COP', 'USD', 'EUR', 'TRY'],
      exchangeRatesToBase: {
        COP: 1,
        USD: 4150,
        EUR: 4500,
        TRY: 120,
      },
      defaultSuggestedAmounts: {
        COP: [20000, 50000, 100000, 250000, 500000],
        USD: [10, 25, 50, 100, 250],
        EUR: [10, 25, 50, 100, 250],
        TRY: [300, 750, 1500, 3000, 6000],
      },
      categories: [
        {
          key: 'utility_bills',
          labels: {
            es: 'Facturas y Servicios de la Mezquita (Luz, Gas, Internet, Agua)',
            en: 'Mosque Utility Invoices (Electricity, Gas, Internet, Water)',
            ar: 'فواتير ومصاريف المسجد (الكهرباء، الغاز، الإنترنت، المياه)',
            tr: 'Cami Faturaları (Elektrik, Doğalgaz, İnternet, Su)',
          },
          descriptions: {
            es: 'Aporta desde $20.000 COP o cubre el saldo restante de un recibo mensual de la mezquita.',
            en: 'Chip in any micro-amount or pay off the remaining balance of a monthly mosque utility bill.',
            ar: 'ساهم بأي مبلغ بسيط أو تكفل بسداد الرصيد المتبقي من فاتورة شهرية للمسجد.',
            tr: 'Küçük bir miktarla katkıda bulunun veya aylık cami faturasının kalan bakiyesini kapatın.',
          },
          taxDeductible: true,
        },
        {
          key: 'zakat',
          labels: {
            es: 'Zakat Al-Mal (2.5% Obligatorio)',
            en: 'Zakat Al-Mal (2.5% Obligatory Alms)',
            ar: 'زكاة المال (2.5% المفروضة)',
            tr: 'Zekât-ı Mal (%2,5 Farz Zekât)',
          },
          descriptions: {
            es: 'Purificación anual del patrimonio que supera el Nisab (85g de oro o 595g de plata).',
            en: 'Annual purification of net wealth exceeding the Nisab threshold (85g Gold or 595g Silver).',
            ar: 'تزكية المال السنوية لمن بلغ نصاب الذهب (85 غراماً) أو الفضة (595 غراماً).',
            tr: 'Nisap miktarını (85g altın veya 595g gümüş) aşan net varlıkların yıllık zekâtı.',
          },
          taxDeductible: true,
          requiresAssessmentCalculator: true,
        },
        {
          key: 'sadaqah',
          labels: {
            es: 'Sadaqah (Caridad Voluntaria y Obra Social)',
            en: 'Sadaqah (Voluntary Charity & Welfare)',
            ar: 'صدقة تطوعية وكفالة اجتماعية',
            tr: 'Sadaka (Gönüllü Hayır ve Sosyal Yardım)',
          },
          taxDeductible: true,
        },
        {
          key: 'waqf',
          labels: {
            es: 'Waqf e Infraestructura de la Mezquita',
            en: 'Waqf Endowment & Mosque Infrastructure',
            ar: 'الوقف الإسلامي وتوسعة المسجد',
            tr: 'Vakıf ve Cami Altyapı Fonu',
          },
          taxDeductible: true,
        },
        {
          key: 'iftar',
          labels: {
            es: 'Iftar Comunitario y Mercados Solidarios',
            en: 'Community Iftar & Food Baskets',
            ar: 'إفطار صائم والسلال الغذائية',
            tr: 'Topluluk İftarı ve Gıda Kolisi',
          },
          taxDeductible: true,
        },
      ],
      assessmentProfiles: [
        {
          key: 'zakat_al_mal',
          labels: {
            es: 'Calculadora de Zakat Al-Mal (2.5% sobre Patrimonio Neto)',
            en: 'Zakat Al-Mal Calculator (2.5% on Net Zakatable Assets)',
            ar: 'حاسبة زكاة المال (2.5% على صافي الأصول الزكوية)',
            tr: 'Zekât Hesaplayıcı (Net Varlıklar Üzerinden %2,5)',
          },
          ratePercent: 2.5,
          defaultBenchmarkKey: 'gold_85g',
          benchmarks: [
            {
              key: 'gold_85g',
              labels: {
                es: 'Nisab en Oro (85 gramos — 24k)',
                en: 'Gold Nisab Standard (85 grams)',
                ar: 'نصاب الذهب (85 غراماً عيار 24)',
                tr: 'Altın Nisabı (85 gram)',
              },
              unitType: 'gram_weight',
              thresholdUnits: 85,
              unitPricesByCurrency: {
                COP: env.int('ZAKAT_GOLD_GRAM_COP', 365000),
                USD: env.int('ZAKAT_GOLD_GRAM_USD', 88),
                EUR: env.int('ZAKAT_GOLD_GRAM_EUR', 81),
                TRY: env.int('ZAKAT_GOLD_GRAM_TRY', 3000),
              },
            },
            {
              key: 'silver_595g',
              labels: {
                es: 'Nisab en Plata (595 gramos)',
                en: 'Silver Nisab Standard (595 grams)',
                ar: 'نصاب الفضة (595 غراماً)',
                tr: 'Gümüş Nisabı (595 gram)',
              },
              unitType: 'gram_weight',
              thresholdUnits: 595,
              unitPricesByCurrency: {
                COP: env.int('ZAKAT_SILVER_GRAM_COP', 4300),
                USD: 1.05,
                EUR: 0.96,
                TRY: 35,
              },
            },
          ],
          fields: [
            {
              key: 'cash_and_bank',
              labels: {
                es: 'Efectivo, Cuentas de Ahorro y Corrientes',
                en: 'Cash, Savings & Checking Accounts',
                ar: 'النقد والحسابات البنكية الجارية والادخارية',
                tr: 'Nakit, Vadeli ve Vadesiz Banka Hesapları',
              },
              kind: 'asset',
            },
            {
              key: 'gold_and_silver',
              labels: {
                es: 'Valor de Oro, Plata y Joyería de Inversión',
                en: 'Gold, Silver & Bullion Value',
                ar: 'قيمة الذهب والفضة المدخرة',
                tr: 'Altın, Gümüş ve Kıymetli Maden Değeri',
              },
              kind: 'asset',
            },
            {
              key: 'investments_and_inventory',
              labels: {
                es: 'Inversiones, Acciones y Mercancía Comercial',
                en: 'Shares, Investments & Trade Inventory',
                ar: 'الأسهم والاستثمارات وعروض التجارة',
                tr: 'Hisseler, Yatırımlar ve Ticari Mallar',
              },
              kind: 'asset',
            },
            {
              key: 'receivables',
              labels: {
                es: 'Préstamos por Cobrar y Deudas Recuperables',
                en: 'Recoverable Loans & Receivables',
                ar: 'الديون المرجوة التحصيل لدى الغير',
                tr: 'Tahsil Edilebilir Alacaklar',
              },
              kind: 'asset',
            },
            {
              key: 'short_term_liabilities',
              labels: {
                es: 'Deudas Inmediatas y Facturas Vencidas por Pagar',
                en: 'Immediate Debts & Short-Term Liabilities',
                ar: 'الديون المستحقة والالتزامات الحالة',
                tr: 'Kısa Vadeli Borçlar ve Ödenecek Faturalar',
              },
              kind: 'deductible_liability',
            },
          ],
        },
      ],
      paymentMethods: [
        {
          key: 'bancolombia',
          channel: 'bank_transfer',
          providerName: 'Bancolombia',
          accountTitle: 'Centro Cultural Islámico de Colombia — Mezquita Central',
          accountNumber: env('MOSQUE_BANCOLOMBIA_ACCOUNT', '031-894520-11'),
          accountType: 'Cuenta Corriente Empresarial',
          taxId: 'NIT 800.194.281-5',
          supportedCurrencies: ['COP'],
          instructions: {
            es: 'Transferencia desde App Bancolombia o corresponsal bancario a nombre del Centro Cultural Islámico.',
            en: 'Transfer via Bancolombia App or branch to Centro Cultural Islámico de Colombia.',
            ar: 'تحويل بنكي عبر تطبيق بانكولومبيا إلى الحساب الرسمي للمركز الثقافي الإسلامي.',
            tr: 'Bancolombia uygulaması veya şubesi üzerinden resmi cami hesabına havale.',
          },
        },
        {
          key: 'nequi',
          channel: 'digital_wallet',
          providerName: 'Nequi Colombia',
          accountTitle: 'Mezquita Central Bogotá (Recaudos)',
          accountNumber: env('MOSQUE_NEQUI_NUMBER', '310 482 9910'),
          supportedCurrencies: ['COP'],
          instructions: {
            es: 'Envía tu aporte o pago de recibo por Nequi o llave Bre-B sin comisión.',
            en: 'Send your micro-donation or utility bill contribution instantaneously via Nequi.',
            ar: 'أرسل مساهمتك فوراً عبر محفظة Nequi الرقمية بدون رسوم.',
            tr: 'Nequi dijital cüzdanı ile anında ve komisyonsuz katkıda bulunun.',
          },
        },
        {
          key: 'daviplata',
          channel: 'digital_wallet',
          providerName: 'Daviplata',
          accountTitle: 'Mezquita Central Bogotá',
          accountNumber: env('MOSQUE_DAVIPLATA_NUMBER', '315 729 4418'),
          supportedCurrencies: ['COP'],
          instructions: {
            es: 'Transferencia rápida desde Daviplata o Davivienda.',
            en: 'Instant mobile transfer via Daviplata or Davivienda.',
            ar: 'تحويل فوري عبر تطبيق Daviplata.',
            tr: 'Daviplata üzerinden hızlı mobil transfer.',
          },
        },
        {
          key: 'wompi',
          channel: 'card_gateway',
          providerName: 'Wompi Bancolombia (PSE / Tarjetas / Nequi)',
          accountTitle: 'Pasarela Oficial Mezquita Central de Bogotá',
          accountNumber: 'PSE • Visa • Mastercard • Amex',
          checkoutUrl: env('MOSQUE_WOMPI_CHECKOUT_URL', 'https://checkout.wompi.co/l/mezquita-bogota'),
          supportedCurrencies: ['COP', 'USD'],
          instructions: {
            es: 'Pago en línea automático con PSE, tarjetas débito/crédito y confirmación por webhook.',
            en: 'Online checkout with PSE, credit/debit cards, and automatic webhook verification.',
            ar: 'دفع إلكتروني مباشر بالبطاقات البنكية أو نظام PSE مع تأكيد تلقائي.',
            tr: 'PSE veya banka/kredi kartı ile otomatik doğrulamalı online ödeme.',
          },
        },
        {
          key: 'paypal',
          channel: 'card_gateway',
          providerName: 'PayPal Internacional',
          accountTitle: 'donaciones@mezquitabogota.org',
          accountNumber: 'donaciones@mezquitabogota.org',
          checkoutUrl: env('MOSQUE_PAYPAL_URL', 'https://www.paypal.com/donate?hosted_button_id=MEZQUITABOGOTA'),
          supportedCurrencies: ['USD', 'EUR', 'TRY'],
          instructions: {
            es: 'Para donantes internacionales en USD, EUR o TRY.',
            en: 'For international donors contributing in USD, EUR, or TRY.',
            ar: 'للمتبرعين الدوليين بالدولار الأمريكي أو اليورو أو الليرة التركية.',
            tr: 'USD, EUR veya TRY cinsinden uluslararası bağışçılar için.',
          },
        },
      ],
      webhookSigningSecret: env('DONATIONS_WEBHOOK_SECRET', ''),
      enableCertificatesBridge: true,
      taxCertificateTemplateSlug: 'dian-donation-certificate',
      autoIssueCertificateOnVerify: true,
      secondaryCalendars: ['islamic-umalqura'],
      campaignMapping: {
        enabled: false,
        uid: 'plugin::donations.campaign',
        fields: {},
      },
      pledgeMapping: {
        enabled: false,
        uid: 'plugin::donations.pledge',
        fields: {},
      },
    },
  };
}
