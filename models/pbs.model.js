const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let PBSSchema = new Schema({
  type: "object",
  required: [],
  properties: {
    _id: {
      type: "object",
      required: [],
      properties: {
        $oid: {
          type: "string"
        }
      }
    },
    "Item.Code": {
      type: "string"
    },
    "GenericDrug.Name": {
      type: "string"
    },
    "GenericDrug.Code": {
      type: "number"
    },
    "GenericDrug.LIName": {
      type: "string"
    },
    "Mp.ID": {
      type: "number"
    },
    "Schedule.Name": {
      type: "string"
    },
    "Schedule.Code": {
      type: "string"
    },
    Brands: {
      type: "object",
      required: [],
      properties: {
        Brand: {
          type: "object",
          required: [],
          properties: {
            "Brand.ID": {
              type: "number"
            },
            "Brand.Name": {
              type: "string"
            },
            "Tpp.ID": {
              type: "number"
            },
            "Mpp.ID": {
              type: "number"
            },
            "Listing.Rule": {
              type: "object",
              required: [],
              properties: {
                code: {
                  type: "string"
                },
                $: {
                  type: "string"
                }
              }
            },
            "Item.FormStrength": {
              type: "string"
            },
            "Item.FormStrengthLI": {
              type: "string"
            },
            "Item.FormStrengthSortCode1": {
              type: "number"
            },
            "Item.PackFormStrength": {
              type: "string"
            },
            "Manufacturer.BookCode": {
              type: "string"
            },
            "Manufacturer.Name": {
              type: "string"
            },
            "Price.PackSize": {
              type: "number"
            },
            "Price.PricingQuantity": {
              type: "number"
            },
            "Price.Premium": {
              type: "string"
            },
            "Price.TherapeuticGroupPremium": {
              type: "string"
            },
            "Price.SpecialPatientContribution": {
              type: "string"
            },
            "Price.CommDispensedPrice": {
              type: "number"
            },
            "Price.ManufacturerPriceToPharmacist": {
              type: "number"
            },
            "Price.ManufacturerPerPackPrice": {
              type: "number"
            },
            "Price.ManufacturerDispensedPrice": {
              type: "number"
            },
            "Price.MRVSN": {
              type: "number"
            },
            "Price.PriceToConsumer": {
              type: "number"
            },
            "Price.PriceToConsumerUpto": {
              type: "string"
            },
            "Price.GroupPriceToPharmacist": {
              type: "number"
            },
            "Price.CommPriceToPharmacist": {
              type: "number"
            },
            "Price.AmountPaidByGovernment": {
              type: "number"
            },
            "Price.PartialPackPrice": {
              type: "number"
            },
            "Price.ManufacturerPartialPackPrice": {
              type: "number"
            },
            "Price.AgreedExManufacturer": {
              type: "number"
            },
            "Price.BioequivalentFlag": {
              type: "string"
            }
          }
        }
      }
    },
    BodySystems: {
      type: "object",
      required: [],
      properties: {
        BodySystem: {
          type: "object",
          required: [],
          properties: {
            "BodySystem.Code": {
              type: "string"
            },
            "BodySystem.Type": {
              type: "string"
            },
            "BodySystem.PrintOption": {
              type: "number"
            },
            ATC1: {
              type: "object",
              required: [],
              properties: {
                "BodySystem.Code": {
                  type: "string"
                }
              }
            },
            ATC2: {
              type: "object",
              required: [],
              properties: {
                "BodySystem.Code": {
                  type: "string"
                }
              }
            },
            ATC3: {
              type: "object",
              required: [],
              properties: {
                "BodySystem.Code": {
                  type: "string"
                }
              }
            },
            ATC4: {
              type: "object",
              required: [],
              properties: {
                "BodySystem.Code": {
                  type: "string"
                }
              }
            }
          }
        }
      }
    },
    "Listing.Rules": {
      type: "object",
      required: [],
      properties: {
        "Listing.Rule": {
          type: "object",
          required: [],
          properties: {
            code: {
              type: "string"
            },
            $: {
              type: "string"
            }
          }
        }
      }
    },
    "Item.FormStrengths": {
      type: "object",
      required: [],
      properties: {
        "Item.FormStrength": {
          type: "string"
        }
      }
    },
    "Item.FormStrengthLIs": {
      type: "object",
      required: [],
      properties: {
        "Item.FormStrengthLI": {
          type: "string"
        }
      }
    },
    "Item.MannerOfAdministration": {
      type: "string"
    },
    "Item.MaxQuantity": {
      type: "string"
    },
    "Item.PackQuantity": {
      type: "string"
    },
    "Item.NumberOfRepeats": {
      type: "string"
    },
    "Item.SafetyNetDays": {
      type: "string"
    },
    "Item.DispensingFeeTypeCodes": {
      type: "object",
      required: [],
      properties: {
        "Item.DispensingFeeTypeCode": {
          type: "string"
        }
      }
    },
    "Note.Codes": {
      type: "object",
      required: [],
      properties: {
        "Note.Code": {
          type: "number"
        }
      }
    },
    "Caution.Codes": {
      type: "string"
    },
    "Restriction.Codes": {
      type: "object",
      required: [],
      properties: {
        "Restriction.Code": {
          type: "object",
          required: [],
          properties: {
            "RestrictionNote.Code": {
              type: "number"
            },
            $: {
              type: "string"
            }
          }
        }
      }
    },
    "Restriction.StreamlinedAuthority": {
      type: "string"
    },
    "Restriction.Type": {
      type: "string"
    },
    "ANSRestriction.Codes": {
      type: "object",
      required: [],
      properties: {
        "ANSRestriction.Code": {
          type: "object",
          required: [],
          properties: {
            "Restriction.Code": {
              type: "string"
            },
            $: {
              type: "number"
            }
          }
        }
      }
    },
    PrescriberGroups: {
      type: "object",
      required: [],
      properties: {
        "PrescriberGroup.Code": {
          type: "string"
        }
      }
    },
    medicarePBS: {
      type: "object",
      required: [],
      properties: {
        NSW: {
          type: "string"
        },
        VIC: {
          type: "string"
        },
        QLD: {
          type: "string"
        },
        SA: {
          type: "string"
        },
        WA: {
          type: "string"
        },
        TAS: {
          type: "string"
        },
        ACT: {
          type: "string"
        },
        NT: {
          type: "string"
        }
      }
    },
    medicareRPBS: {
      type: "object",
      required: [],
      properties: {
        NSW: {
          type: "string"
        },
        VIC: {
          type: "string"
        },
        QLD: {
          type: "string"
        },
        SA: {
          type: "string"
        },
        WA: {
          type: "string"
        },
        TAS: {
          type: "string"
        },
        ACT: {
          type: "string"
        },
        NT: {
          type: "string"
        }
      }
    }
  }
});

PBSSchema.index({
  "$**": "text"
});

module.exports = mongoose.model("pbs", PBSSchema, "pbs");
