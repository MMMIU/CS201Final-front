let lobbyDemo = {
  roomNumber: 1,
  opponent: 'FC',
  questions: [
    {
      index: 1,
      question: 'hello1',
      options: ['A1', 'B', 'C', 'D'],
      answer: 0
    },
    {
      index: 2,
      question: 'hello2',
      options: ['A', 'B2', 'C', 'D'],
      answer: 1
    },
    {
      index: 3,
      question: 'hello3',
      options: ['A3', 'B', 'C3', 'D'],
      answer: 2
    },
    {
      index: 4,
      question: 'hello4',
      options: ['A4', 'B', 'C', 'D4'],
      answer: 3
    }
  ]
}

export default {
  'post|/goBattle': option => {
    return {
      status: 200,
      data: lobbyDemo
    }
  }
}
