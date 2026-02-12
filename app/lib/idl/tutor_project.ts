export type TutorProject = {
  "address": "DC5BMrRcTAQEk2N8B6eYzxDyuCWXjLVqP3MJEg8F2fgu",
  "metadata": {
    "name": "tutor_project",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "create_tutor",
      "discriminator": [
        182,
        110,
        28,
        29,
        29,
        42,
        225,
        1
      ],
      "accounts": [
        {
          "name": "tutor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  117,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "subject",
          "type": "string"
        }
      ]
    },
    {
      "name": "update_progress",
      "discriminator": [
        135,
        47,
        78,
        113,
        27,
        158,
        21,
        111
      ],
      "accounts": [
        {
          "name": "tutor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  117,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "tutor"
          ]
        }
      ],
      "args": [
        {
          "name": "new_level",
          "type": "u8"
        },
        {
          "name": "milestone_hash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Tutor",
      "discriminator": [
        152,
        126,
        45,
        89,
        62,
        19,
        148,
        76
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SubjectTooLong",
      "msg": "Subject must be 50 characters or less"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "Only the tutor owner can update progress"
    }
  ],
  "types": [
    {
      "name": "Tutor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "subject",
            "type": "string"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "milestone_hash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "last_updated",
            "type": "i64"
          }
        ]
      }
    }
  ]
};

export const IDL: TutorProject = {
  "address": "DC5BMrRcTAQEk2N8B6eYzxDyuCWXjLVqP3MJEg8F2fgu",
  "metadata": {
    "name": "tutor_project",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "create_tutor",
      "discriminator": [
        182,
        110,
        28,
        29,
        29,
        42,
        225,
        1
      ],
      "accounts": [
        {
          "name": "tutor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  117,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "user"
              }
            ]
          }
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "system_program",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "subject",
          "type": "string"
        }
      ]
    },
    {
      "name": "update_progress",
      "discriminator": [
        135,
        47,
        78,
        113,
        27,
        158,
        21,
        111
      ],
      "accounts": [
        {
          "name": "tutor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  117,
                  116,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "tutor"
          ]
        }
      ],
      "args": [
        {
          "name": "new_level",
          "type": "u8"
        },
        {
          "name": "milestone_hash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Tutor",
      "discriminator": [
        152,
        126,
        45,
        89,
        62,
        19,
        148,
        76
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "SubjectTooLong",
      "msg": "Subject must be 50 characters or less"
    },
    {
      "code": 6001,
      "name": "Unauthorized",
      "msg": "Only the tutor owner can update progress"
    }
  ],
  "types": [
    {
      "name": "Tutor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "subject",
            "type": "string"
          },
          {
            "name": "level",
            "type": "u8"
          },
          {
            "name": "milestone_hash",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "last_updated",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
