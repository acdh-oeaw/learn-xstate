import { assign, setup } from 'xstate';

export const formviewMachine = setup({
  types: {
    context: {} as {
      items: Record<string,unknown>[];
      edititem: Record<string,unknown>;
      edititemindex: number;
      itemsprops: Record<string,Record<string, string>>;
      simpleformactive: boolean;
    },
    events: {} as
        {
          type: 'addItem.simple.submit';
          value: Record<string,unknown>[];
        }
      | {
          type: 'addItem.full.submit';
          value: Record<string,unknown>[];
        }
      | {
          type: 'removeItem';
          value: number;
        }
      | {
          type: 'editItem';
          value: number;
        }
      | {
          type: 'saveItem';
        }
      | { type: 'cancelEdit' }
      | { type: 'toggleForm' }
  },
  guards: {
    itemsValid: ({ context, event }) => {
        let check = true;
        //ts-expect-error only works with addItem.* events
        event.value.forEach((item: Record<string,unknown>) => {
          Object.keys(context.itemsprops).forEach((key  ) => {
            if (item[key] === undefined) {
                check = false;
            }
          });
        });
        return check;
    }
  }
}).createMachine({
  id: 'formlist',
  initial: 'additem_simple',
  context: {
    items: [
      {
        "amount": 124,
        "aspect": {
          "_id": "5c90a0119ca403074db61853",
          "identifier": [],
          "_history": [],
          "name": "Höhe",
          "_labels": [],
          "_authorityRecs": [],
          "instanceOf": "5c90a00e9ca403074db6095b",
          "relations": [],
          "__v": 0,
          "__lastAccessedBy": "eryka.meneghini@gmail.com",
          "__lastAccessedIn": "2022-04-19T14:10:09.507Z",
          "labels": [
            {
              "lang": "de",
              "label": "Höhe"
            },
            {
              "lang": "en",
              "label": "Height"
            }
          ]
        },
        "unit": {
          "_id": "5c90a0119ca403074db61857",
          "identifier": [
            "ADLIBTHESAU:130"
          ],
          "_history": [],
          "name": "cm",
          "_labels": [],
          "_authorityRecs": [],
          "instanceOf": "5c90a00e9ca403074db60969",
          "relations": [
            {
              "target": "5c90a0119ca403074db61863",
              "kind": "partOf",
              "annotation": "100"
            },
            {
              "target": "5c90a0119ca403074db61b9f",
              "kind": "partOf",
              "annotation": "2.54"
            }
          ],
          "__v": null,
          "__lastAccessedBy": "choffmann",
          "__lastAccessedIn": "2019-09-19T09:41:35.490Z",
          "labels": []
        }
      },
      {
        "amount": 159,
        "aspect": {
          "_id": "5c90a0119ca403074db61856",
          "identifier": [],
          "_history": [],
          "name": "Breite",
          "_labels": [],
          "_authorityRecs": [],
          "instanceOf": "5c90a00e9ca403074db6095b",
          "relations": [],
          "__v": 0,
          "__lastAccessedBy": "eryka.meneghini@gmail.com",
          "__lastAccessedIn": "2022-04-19T14:09:20.067Z",
          "labels": [
            {
              "lang": "de",
              "label": "Breite"
            },
            {
              "lang": "en",
              "label": "Width"
            }
          ]
        },
        "unit": {
          "_id": "5c90a0119ca403074db61857",
          "identifier": [
            "ADLIBTHESAU:130"
          ],
          "_history": [],
          "name": "cm",
          "_labels": [],
          "_authorityRecs": [],
          "instanceOf": "5c90a00e9ca403074db60969",
          "relations": [
            {
              "target": "5c90a0119ca403074db61863",
              "kind": "partOf",
              "annotation": "100"
            },
            {
              "target": "5c90a0119ca403074db61b9f",
              "kind": "partOf",
              "annotation": "2.54"
            }
          ],
          "__v": null,
          "__lastAccessedBy": "choffmann",
          "__lastAccessedIn": "2019-09-19T09:41:35.490Z",
          "labels": []
        }
      }
    ],
    itemsprops: {
      "amount":{"type":"number"},
      "aspect":{"type":"string","x-ref":"descriptor","description":"Refers to descriptor","pattern":"^[0-9a-fA-F]{24}$"},
      "unit":{"type":"string","x-ref":"descriptor","description":"Refers to descriptor","pattern":"^[0-9a-fA-F]{24}$"}
    },
    simpleformactive: true,
    edititem: {},
    edititemindex: -1,
  },
  states: {
    additem_simple: {
      on: {
        'addItem.simple.submit': {
          guard: 'itemsValid',
          actions: assign({
            items: ({ context, event }) => {
              return context.items.concat(event.value);
            }
          }),
        },
      }
    },
    additem_full: {
      on: {
        'addItem.full.submit': {
          actions: assign({
            items: ({ context, event }) => {
              return context.items.concat(event.value);
            }
          }),
        },
      }
    },
    edititem_full: {
      on: {
        'saveItem': {
          target: 'additem_simple',
          actions: assign({
            items: ({ context}) => {
              const items = context.items;
              items[context.edititemindex] = context.edititem;
              return items;
            },
            simpleformactive: true,
            edititem: {},
            edititemindex: -1,
          }),
        },
      }
    },
  },
  on: {
    toggleForm: [
        {
          guard: ({ context }) => context.simpleformactive,
          target: '.additem_full',
          actions: assign({
            simpleformactive: false,
            edititem: {},
            edititemindex: -1,
          }),
        },
        {
          target: '.additem_simple',
          actions: assign({
            simpleformactive: true,
            edititem: {},
            edititemindex: -1,
          }),
        }
    ],
    removeItem: {
      actions: assign({
        items: ({ context, event }) => {
          const index = event.value;
          return context.items.filter((_, i) => i !== index);
        }
      })
    },
    editItem: {
      target: '.edititem_full',
      actions: assign({
        edititem: ({ context, event }) => {
          return context.items[event.value];
        },
        edititemindex: ({ context, event }) => {
          return event.value;
        },
      }),
    },
  }
});
