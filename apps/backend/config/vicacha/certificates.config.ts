export function buildMosqueCertificatesPluginConfig(env: any, hijriCalendar: any) {
  return {
    enabled: true,
    config: {
      organizationName: 'Mezquita Central Abu Bakr As-Siddiq de Bogotá',
      organizationSubheader:
        'Centro Cultural Islámico de Colombia — Bogotá D.C., Colombia',
      verificationBaseUrl: env(
        'CERTIFICATES_VERIFY_URL',
        `${env('FRONTEND_URL', 'http://127.0.0.1:4321')}/verify-certificate`
      ),
      defaultTimezone: env('CERTIFICATES_TIMEZONE', 'America/Bogota'),
      defaultLocale: 'es',
      maskPublicRecipientName: true,
      allowPublicApplications: true,
      secondaryCalendars: [hijriCalendar],
      esign: {
        enabled: Boolean(env('DOCUSIGN_ACCOUNT_ID', '')),
        provider: env('DOCUSIGN_ACCOUNT_ID', '') ? 'docusign' : 'none',
        baseUrl: env(
          'DOCUSIGN_BASE_URL',
          'https://demo.docusign.net/restapi'
        ),
        accountId: env('DOCUSIGN_ACCOUNT_ID', ''),
        integrationKey: env('DOCUSIGN_INTEGRATION_KEY', ''),
        emailSubjectPrefix:
          'Mezquita Central de Bogotá — Firma de Certificado Oficial',
      },
      defaultTemplates: [
        {
          name: 'Certificado Oficial de Shahada (Profesión de Fe Islámica)',
          slug: 'shahada-certificate',
          description:
            'Certificado oficial firmado criptográficamente (Ed25519) para nuevos musulmanes que pronuncian la Shahada ante el Imam y dos testigos oficiales.',
          serialPrefix: 'SHD',
          defaultValidityDays: null,
          requiresWitnesses: true,
          minWitnesses: 2,
          requiresApproval: true,
          esignEnabled: true,
          esignProvider: 'docusign',
          organizationName: 'Mezquita Central Abu Bakr As-Siddiq de Bogotá',
          organizationSubheader:
            'Centro Cultural Islámico de Colombia — Bogotá D.C., Colombia',
          headerText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          titleText:
            'Certificado Oficial de Profesión de Fe Islámica (Shahada)',
          bodyTemplate:
            'La Mezquita Central Abu Bakr As-Siddiq de Bogotá certifica oficialmente que {{recipientFullName}} (Nombre Islámico adoptado: {{chosenName}}), identificado(a) con documento {{nationalIdMasked}}, pronunció libre y sinceramente el Testimonio de Fe Islámica (Ash-hadu an la ilaha illa Allah wa ash-hadu anna Muhammadan Rasulu Allah) el día {{issuedDateFormatted}} ({{secondaryDateFormatted}}), ingresando a la comunidad musulmana ante el Imam y los testigos oficiales abajo firmantes.',
          footerText:
            'Válido para trámites comunitarios, matrimonio islámico (Nikah) y solicitud de visado de Hajj / Umrah ante representaciones consulares.',
          defaultSignatories: [
            {
              name: 'Sheikh Principal de la Mezquita',
              title: 'Imam y Director Espiritual',
              role: 'Autoridad Religiosa',
              email: env('MOSQUE_IMAM_EMAIL', 'imam@mezquitabogota.org'),
              routingOrder: 2,
            },
            {
              name: 'Presidente de la Junta Directiva',
              title: 'Representante Legal',
              role: 'Dirección Institucional',
              email: env(
                'MOSQUE_PRESIDENT_EMAIL',
                'presidencia@mezquitabogota.org'
              ),
              routingOrder: 2,
            },
          ],
          secondaryCalendars: [hijriCalendar],
          accentColor: '#14532d',
          active: true,
        },
        {
          name: 'Certificado Consular de Pertenencia a la Comunidad Musulmana (Hajj / Umrah)',
          slug: 'muslim-membership-certificate',
          description:
            'Certificación oficial de pertenencia activa a la comunidad musulmana para trámites consulares de Hajj, Umrah y Nikah.',
          serialPrefix: 'MSC',
          defaultValidityDays: 365,
          requiresWitnesses: false,
          minWitnesses: 0,
          requiresApproval: true,
          organizationName: 'Mezquita Central Abu Bakr As-Siddiq de Bogotá',
          organizationSubheader:
            'Centro Cultural Islámico de Colombia — Bogotá D.C., Colombia',
          headerText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          titleText: 'Certificado Oficial de Pertenencia Islámica',
          bodyTemplate:
            'Por medio de la presente, la {{organizationName}} certifica que {{recipientFullName}}, con documento {{nationalIdMasked}}, es miembro reconocido(a) de la comunidad musulmana de Bogotá D.C. Este certificado se expide el {{issuedDateFormatted}} ({{secondaryDateFormatted}}) para fines consulares, visado de peregrinación (Hajj / Umrah) y trámites religiosos oficiales.',
          defaultSignatories: [
            {
              name: 'Sheikh Principal de la Mezquita',
              title: 'Imam y Director Espiritual',
              role: 'Autoridad Religiosa',
            },
          ],
          secondaryCalendars: [hijriCalendar],
          accentColor: '#0f766e',
          active: true,
        },
        {
          name: 'Certificado Tributario de Donación (DIAN Estatuto Tributario Art. 125-2 / Art. 257)',
          slug: 'dian-donation-certificate',
          description:
            'Certificado oficial de donación expedido por el Centro Cultural Islámico de Colombia (ESAL) para descuento tributario ante la DIAN.',
          serialPrefix: 'DON-DIAN',
          defaultValidityDays: 0,
          requiresWitnesses: false,
          minWitnesses: 0,
          requiresApproval: true,
          organizationName: 'Centro Cultural Islámico de Colombia — Mezquita Central Abu Bakr As-Siddiq',
          organizationSubheader: 'NIT 800.194.281-5 • Entidad Sin Ánimo de Lucro (Régimen Tributario Especial DIAN)',
          headerText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          titleText: 'Certificado Oficial de Donación — Efectos Tributarios DIAN',
          bodyTemplate:
            'El suscrito Representante Legal y Revisor Fiscal del {{organizationName}} certifican que {{recipientFullName}}, identificado(a) con documento {{nationalIdMasked}}, realizó una donación verificada e irrevocable el {{issuedDateFormatted}} ({{secondaryDateFormatted}}), destinada exclusivamente al desarrollo del objeto social, sostenimiento de servicios públicos de la mezquita y programas comunitarios de la entidad, conforme a los artículos 125-2 y 257 del Estatuto Tributario de Colombia.',
          defaultSignatories: [
            {
              name: 'Presidente y Representante Legal',
              title: 'Representante Legal',
              role: 'Dirección Institucional',
              email: env('MOSQUE_PRESIDENT_EMAIL', 'presidencia@mezquitabogota.org'),
              routingOrder: 1,
            },
            {
              name: 'Contador Público / Revisor Fiscal',
              title: 'Revisoría Fiscal',
              role: 'Certificación Contable DIAN',
              email: env('MOSQUE_TREASURER_EMAIL', 'contabilidad@mezquitabogota.org'),
              routingOrder: 2,
            },
          ],
          secondaryCalendars: [hijriCalendar],
          accentColor: '#14532d',
          active: true,
        },
      ],
    },
  };
}
