/* A hand-written sample draft for the prefilled brief. It keeps the demo whole
   when live drafting is unavailable (no key, no network) or when `?sample` is
   in the URL. It is written in the house voice and labeled as a sample in the UI. */
import type { Proposal } from '../shared/proposal';

export const SAMPLE_PROPOSAL: Proposal = {
  title: 'Two Horizons, One Quiet Beginning',
  overview:
    'You begin on the high plains of Kenya, where mornings are spent in open country with a private guide and afternoons are left deliberately unscheduled. Short light-aircraft hops replace long roads throughout. You then cross the Indian Ocean to a private island in the Seychelles, where the pace slows to the tide and your anniversary is marked simply, and well.',
  days: [
    {
      day: 1,
      title: 'Arrival in Nairobi',
      narrative:
        'You are met on the aircraft steps and guided through arrivals without the usual queues. A short drive brings you to a garden residence on the edge of the city, where the evening is yours: a late supper on the veranda, the sound of the forest beyond the lawn, and an early night before the plains.',
      highlights: [
        'Private meet-and-assist on arrival',
        'Quiet supper served on your veranda',
        'An unhurried evening to settle in',
      ],
    },
    {
      day: 2,
      title: 'Into the Masai Mara',
      narrative:
        'A light aircraft lifts you from Wilson Airport and, within the hour, sets you down on a grass strip in the Mara. Your guide, who will stay with you for the length of your time here, drives you the short distance to camp along the escarpment. The afternoon is for settling in; the first game drive can wait until the light turns gold.',
      highlights: [
        'Light-aircraft transfer, under an hour',
        'A private guide and vehicle for your stay',
        'First drive at golden hour',
      ],
    },
    {
      day: 3,
      title: 'The Plains at First Light',
      narrative:
        'You leave camp before sunrise with coffee in the vehicle and no fixed route. Your guide reads the morning and follows it, whether that means a pride on the move or a long, quiet wait by the river. Breakfast is laid out under an acacia wherever you happen to be, and the heat of the day is spent back at camp.',
      highlights: [
        'Dawn departure on your own schedule',
        'Bush breakfast wherever the morning leads',
        'Afternoon at leisure',
      ],
    },
    {
      day: 4,
      title: 'Above the Mara',
      narrative:
        'Before dawn, you rise quietly over the river valley in a hot-air balloon, the plains widening beneath you as the sun comes up. You land to a simple champagne breakfast in the grass. Later, a Maasai elder you have been introduced to walks with you near the village, sharing the land as his family knows it.',
      highlights: [
        'Sunrise balloon flight over the river valley',
        'Champagne breakfast where you land',
        'A walk with a Maasai elder',
      ],
    },
    {
      day: 5,
      title: 'An Unhurried Day',
      narrative:
        'Nothing is planned, by design. You might take a slow afternoon drive, a massage on your deck, or simply watch the escarpment change color from the pool. In the evening, a table is set for two away from camp, lit by lanterns, with your guide keeping a discreet distance.',
      highlights: [
        'A day left deliberately open',
        'Private lantern-lit dinner in the bush',
      ],
    },
    {
      day: 6,
      title: 'North to Laikipia',
      narrative:
        'A short flight carries you north to the conservancies of Laikipia, where the landscape turns to ridges and open grassland beneath Mount Kenya. You stay at a small lodge of only a handful of rooms. In the afternoon, you may visit the conservancy team working to protect black and white rhino.',
      highlights: [
        'Scenic light-aircraft hop north',
        'Time with the rhino conservation team',
        'Sundowners on the ridge',
      ],
    },
    {
      day: 7,
      title: 'Horseback and High Country',
      narrative:
        'The morning is spent on horseback or on foot, moving through country where zebra and giraffe let you come closer than a vehicle ever could. Should you prefer, a helicopter can take you to a remote lake for a picnic lunch. The evening closes by the fire, beneath a sky with no lights for many miles.',
      highlights: [
        'Guided ride or walk among plains game',
        'Optional helicopter picnic at a remote lake',
        'Fireside evening under clear skies',
      ],
    },
    {
      day: 8,
      title: 'Across the Indian Ocean',
      narrative:
        'You fly back through Nairobi and onward to Mahé, a flight of a little under four hours. On arrival, a helicopter takes you the final stretch to a private island, where you are met barefoot on the sand. Your villa opens directly onto the beach, and the rest of the day belongs to the water.',
      highlights: [
        'Seamless connection through Nairobi',
        'Helicopter transfer to the island',
        'A villa opening onto the sand',
      ],
    },
    {
      day: 9,
      title: 'The Island at Your Pace',
      narrative:
        'There is no schedule on the island. You might snorkel the house reef in the morning, cycle to a cove you have entirely to yourselves, or spend the afternoon with a book in the shade. Your villa host arranges everything quietly, including dinner wherever you would like it that evening.',
      highlights: [
        'Snorkeling on the house reef',
        'A cove of your own for the afternoon',
      ],
    },
    {
      day: 10,
      title: 'Among the Giant Tortoises',
      narrative:
        'The island ecologist walks with you through the restored forest and introduces you to the giant tortoises that roam freely here. In the late afternoon, you head out by boat to watch the sun set over the neighboring islands, returning in the dark to a table laid on the sand.',
      highlights: [
        'A walk with the island ecologist',
        'Sunset by private boat',
        'Dinner laid on the beach',
      ],
    },
    {
      day: 11,
      title: 'Your Anniversary',
      narrative:
        'The day is kept simple, and yours. A slow morning, a long treatment for two in the spa pavilion, and in the evening a private dinner on a secluded headland, prepared by the chef around what the boats brought in that morning. There are no speeches or surprises, just the two of you and the ocean.',
      highlights: [
        'Spa ritual for two',
        'Private anniversary dinner on the headland',
        "A menu built around the day's catch",
      ],
    },
    {
      day: 12,
      title: 'A Last Day on the Water',
      narrative:
        'You spend the morning sailing or fishing with the island skipper, depending on the wind. The afternoon is for a final swim and a last look at the reef. In the evening, your host arranges a quiet farewell supper in the villa.',
      highlights: [
        'Morning under sail with the skipper',
        'Farewell supper in your villa',
      ],
    },
    {
      day: 13,
      title: 'Homeward',
      narrative:
        'After a late breakfast, the helicopter returns you to Mahé for your international flight. Your Designer will have confirmed every connection in advance, so the journey home asks nothing of you.',
      highlights: [
        'Helicopter return to Mahé',
        'Assisted departure',
      ],
    },
  ],
  stays: [
    {
      location: 'Nairobi',
      suggestion:
        'A garden residence in a leafy suburb, gracious and quiet, with a veranda for supper. Properties such as Hemingways Nairobi or Giraffe Manor.',
    },
    {
      location: 'Masai Mara',
      suggestion:
        'An intimate camp on the escarpment with wide views, private decks, and guides of real standing. Properties such as Angama Mara or Mahali Mzuri.',
    },
    {
      location: 'Laikipia',
      suggestion:
        'A small conservancy lodge of only a few rooms, grounded in rhino conservation, with riding and walking from the door. Properties such as Segera or Lewa Wilderness.',
    },
    {
      location: 'Seychelles',
      suggestion:
        'A private island of barefoot villas and restored forest, where a dedicated host looks after everything. Properties such as North Island or Frégate Island Private.',
    },
  ],
  accessTouches: [
    'A private guide and vehicle throughout Kenya, chosen for their knowledge of the Mara and their sense of when to stay quiet.',
    'An introduction to the conservancy rangers in Laikipia, with time alongside the team protecting the rhino.',
    'A walk with a Maasai elder, arranged personally rather than as a scheduled visit.',
    'A secluded headland reserved for your anniversary dinner, with a menu shaped by the chef around the day.',
    'After-hours time with the island ecologist once the day guests have left.',
  ],
  disclaimer:
    'This is a first draft, shaped for your Travel Designer to refine. Every property, timing, and arrangement is subject to their confirmation.',
};
