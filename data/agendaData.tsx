
  export const days = [
    { id: 'day1', label: 'Day 1', date: 'April 25' },
    { id: 'day2', label: 'Day 2', date: 'April 26' },
    { id: 'day3', label: 'Day 3', date: 'April 27' },
  ];

  export const agendaData = {
    day1: [
      { time: '09:00 - 10:00', title: 'Registration', type: 'general' },
      { time: '10:00 - 11:30', title: 'Opening Ceremony', type: 'general' },
      { time: '11:30 - 12:30', title: 'Industry Keynote', type: 'keynote' },
      { time: '12:30 - 14:00', title: 'Lunch Break', type: 'break' },
      { time: '14:00 - 15:30', title: 'Technical Sessions (Track A)', type: 'session' },
      { time: '15:30 - 16:00', title: 'Coffee Break', type: 'break' },
      { time: '16:00 - 17:30', title: 'Panel Discussion', type: 'panel' },
      { time: '19:00 - 21:00', title: 'Welcome Reception', type: 'social' },
    ],
    day2: [
      { time: '09:30 - 10:30', title: 'Academic Keynote', type: 'keynote' },
      { time: '10:30 - 12:00', title: 'Technical Sessions (Track B)', type: 'session' },
      { time: '12:00 - 13:30', title: 'Lunch Break', type: 'break' },
      { time: '13:30 - 15:00', title: 'Poster Sessions', type: 'session' },
      { time: '15:00 - 15:30', title: 'Coffee Break', type: 'break' },
      { time: '15:30 - 17:00', title: 'Workshops', type: 'workshop' },
      { time: 'Free Evening', title: 'Explore the City', type: 'social' },
    ],
    day3: [
      { time: '09:30 - 11:00', title: 'Technical Sessions (Track C)', type: 'session' },
      { time: '11:00 - 11:30', title: 'Coffee Break', type: 'break' },
      { time: '11:30 - 13:00', title: 'Industry Showcase', type: 'showcase' },
      { time: '13:00 - 14:30', title: 'Lunch Break', type: 'break' },
      { time: '14:30 - 16:00', title: 'Closing Ceremony', type: 'general' },
      { time: '16:00 - 17:30', title: 'Farewell Networking', type: 'social' },
    ]
  };

  export const getEventColor = (type: string) => {
    switch (type) {
      case 'keynote':
        return '#E53935';
      case 'session':
        return '#43A047';
      case 'break':
        return '#1E88E5';
      case 'workshop':
        return '#FB8C00';
      case 'panel':
        return '#8E24AA';
      case 'social':
        return '#00ACC1';
      case 'showcase':
        return '#FFB300';
      default:
        return '#757575';
    }
  };