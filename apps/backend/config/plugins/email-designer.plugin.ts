export function buildEmailDesignerPluginConfig() {
  return {
    enabled: true,
    config: {
      appearance: {
        theme: "modern_light",
        panels: {
          tools: {
            dock: "left",
          },
        },
      },
      mergeTags: {
        mosque: {
          name: "Mosque Info",
          mergeTags: {
            name: {
              name: "Mosque Name",
              value: "{{mosque.name}}",
              sample: "Mezquita Central Abu Bakr As-Siddiq",
            },
            address: {
              name: "Mosque Address",
              value: "{{mosque.address}}",
              sample: "Calle 80 # 30-15, Bogotá D.C., Colombia",
            },
            phone: {
              name: "Mosque Phone",
              value: "{{mosque.phone}}",
              sample: "+57 (601) 250-8000",
            },
            email: {
              name: "Mosque Email",
              value: "{{mosque.email}}",
              sample: "info@mezquitabogota.org",
            },
          },
        },
        visitor: {
          name: "Contact / Visitor",
          mergeTags: {
            fullName: {
              name: "Full Name",
              value: "{{visitor.fullName}}",
              sample: "Ahmad Mansoor",
            },
            email: {
              name: "Email Address",
              value: "{{visitor.email}}",
              sample: "visitor@example.org",
            },
            phone: {
              name: "Phone Number",
              value: "{{visitor.phone}}",
              sample: "+57 310 555-0199",
            },
            subject: {
              name: "Inquiry Category",
              value: "{{visitor.subject}}",
              sample: "general",
            },
            message: {
              name: "Message Body",
              value: "{{visitor.message}}",
              sample:
                "As-salamu alaykum, I would like information about Friday prayers.",
            },
          },
        },
        booking: {
          name: "Guided Visit Booking",
          mergeTags: {
            visitorName: {
              name: "Visitor Name",
              value: "{{booking.visitorName}}",
              sample: "Prof. Carlos Gómez",
            },
            organizationOrSchool: {
              name: "Organization / School",
              value: "{{booking.organizationOrSchool}}",
              sample: "Universidad Nacional de Colombia",
            },
            preferredDate: {
              name: "Preferred Date",
              value: "{{booking.preferredDate}}",
              sample: "2026-11-15",
            },
            preferredTimeSlot: {
              name: "Preferred Time Slot",
              value: "{{booking.preferredTimeSlot}}",
              sample: "10:00 AM",
            },
            groupSize: {
              name: "Group Size",
              value: "{{booking.groupSize}}",
              sample: "25",
            },
            preferredGuideLanguage: {
              name: "Guide Language",
              value: "{{booking.preferredGuideLanguage}}",
              sample: "es",
            },
            notes: {
              name: "Notes",
              value: "{{booking.notes}}",
              sample: "University comparative religion class visit",
            },
          },
        },
        donation: {
          name: "Donation & DIAN Receipt",
          mergeTags: {
            donorName: {
              name: "Donor Name",
              value: "{{donation.donorName}}",
              sample: "Amina Ramírez",
            },
            amount: {
              name: "Amount",
              value: "{{donation.amount}}",
              sample: "250000",
            },
            currency: {
              name: "Currency",
              value: "{{donation.currency}}",
              sample: "COP",
            },
            donationType: {
              name: "Donation Category",
              value: "{{donation.donationType}}",
              sample: "zakat",
            },
            paymentMethodUsed: {
              name: "Payment Method",
              value: "{{donation.paymentMethodUsed}}",
              sample: "bancolombia",
            },
            transactionReference: {
              name: "Transaction Reference",
              value: "{{donation.transactionReference}}",
              sample: "TXN-984120",
            },
            requestsTaxCertificate: {
              name: "Requests DIAN Tax Certificate",
              value: "{{donation.requestsTaxCertificate}}",
              sample: "Yes",
            },
          },
        },
      },
    },
  };
}
