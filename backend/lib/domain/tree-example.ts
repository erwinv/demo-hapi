export default {
  flattenedTree: {
    '0': [{ id: 10, title: 'House', parent_id: null }],
    '1': [
      { id: 12, title: 'Red Roof', parent_id: 10 },
      { id: 13, title: 'Wall', parent_id: 10 },
      { id: 18, title: 'Blue Roof', parent_id: 10 },
    ],
    '2': [
      { id: 15, title: 'Red Window', parent_id: 12 },
      { id: 16, title: 'Door', parent_id: 13 },
      { id: 17, title: 'Blue Window', parent_id: 12 },
    ],
  },
  inflatedTree: {
    id: 10,
    title: 'House',
    children: [
      {
        id: 12,
        title: 'Red Roof',
        children: [
          {
            id: 15,
            title: 'Red Window',
          },
          {
            id: 17,
            title: 'Blue Window',
          },
        ],
      },
      {
        id: 13,
        title: 'Wall',
        children: [{ id: 16, title: 'Door' }],
      },
      {
        id: 18,
        title: 'Blue Roof',
      },
    ],
  },
}
