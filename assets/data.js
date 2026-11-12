// Everything editable in one place. Swap the samples for the real thing as each goes live.
window.SITE = {
  previewMode: true,       // Shows "preview" notes and keeps checkout in test mode. Turn off only once payments are connected.
  email: 'hello@abrighterhumanity.com',
  signupEndpoint: '',      // email provider form endpoint (POST with `email`)
  stripePublishableKey: '',
  shopifyDomain: '',
  youtubeUrl: '', spotifyUrl: '', appleUrl: '', instagramUrl: '', tiktokUrl: '',
};

window.THEMES = ['Academics', 'Music', 'Art', 'Fashion', 'Love', 'Life'];

// Planned line-up for review. None of these guests is confirmed and nothing has been recorded.
// When an episode is recorded, add `audio`, a `date`, optionally `youtubeId`, and remove `planned`.
window.EPISODES = [
  { id: 'tracey', photo: 'assets/img/guests/tracey.jpg', credit: 'Photo: Cyrus Mower, CC BY-SA 4.0', n: 6, planned: true, title: 'What pain teaches us about being human', guest: 'Professor Irene Tracey', role: 'University of Oxford', theme: 'Academics', color: '#FFD15C', blurb: 'A neuroscientist who has spent her career studying how the brain creates the experience of pain, and how belief and attention can change it.' },
  { id: 'fredrickson', photo: 'assets/img/guests/fredrickson.jpg', credit: 'Photo: Gabriella Clare Marino, CC BY-SA 4.0', n: 4, planned: true, title: 'Do good feelings build a good life?', guest: 'Professor Barbara Fredrickson', role: 'University of North Carolina', theme: 'Life', color: '#FF9A62', blurb: 'A psychologist of positive emotions on what joy and connection build in us over time.' },
  { id: 'blakemore', photo: 'assets/img/guests/blakemore.jpg', credit: 'Photo: Shamus O’Reilly, CC BY 2.0', n: 3, planned: true, title: 'How the teenage years make us who we are', guest: 'Professor Sarah-Jayne Blakemore', role: 'University of Cambridge', theme: 'Life', color: '#8FDCCB', blurb: 'A neuroscientist of the adolescent brain on the years that shape who we become, and why they deserve more respect.' },
  { id: 'beard', photo: 'assets/img/guests/beard.jpg', credit: 'Photo: UC3M, CC BY 3.0', n: 2, planned: true, title: 'What the ancient world can tell us about living well', guest: 'Professor Mary Beard', role: 'University of Cambridge', theme: 'Academics', color: '#BDA5F4', blurb: 'A classicist on what the Romans can and can’t teach us about how to live now.' },
  { id: 'ep01', n: 1, title: 'Jumping off the conveyor belt', guest: '', role: 'Abigail, solo', theme: 'Life', planned: true, color: '#FF9FB8', blurb: 'Abigail on leaving the law, and the one question she’s been asking ever since.', youtubeId: '' },
];

// Member-only extras. Add `audio` and `secs` once each is recorded.
window.BONUS = [
  { title: 'Members’ Q&A: how do you actually leave?' },
];
window.READING = [
  { book: 'The reading list goes here', note: 'Abigail’s real picks, with her notes, replace this sample.' },
  { book: 'One book for each episode', note: 'Add the title, the author and a line on why it matters.' },
];

// Prices are placeholders until Abigail sets them.
window.PRODUCTS = [
  { id: 'tote', name: 'The Conveyor Tote', price: 2200, img: 'assets/img/shop/tote.jpg', color: '#F2A9BC', line: 'Heavy cream canvas. “Jumped off the conveyor belt.”', detail: 'For books, and the sandwich you’ll eat outdoors. Long handles, flat base, printed in the UK.', alt: 'A cream canvas tote bag printed with “Jumped off the conveyor belt”.' },
  { id: 'tee', name: 'The Objection Tee', price: 3200, img: 'assets/img/shop/tee.jpg', color: '#F3C65A', line: 'Soft, roomy, inadmissible in court.', detail: 'Heavyweight organic cotton in claret, cut roomy. “Objection! (to the whole thing)” on the chest.', sizes: ['XS', 'S', 'M', 'L', 'XL'], alt: 'A claret T-shirt printed with “Objection! (to the whole thing)”.' },
  { id: 'mug', name: 'The Morning Mug', price: 1600, img: 'assets/img/shop/mug.jpg', color: '#7DC4B5', line: 'Blue and white. “Mantra pending.”', detail: 'Glazed ceramic with a hand-drawn floral border. For the first hour, which is still yours.', alt: 'A white mug with a blue floral border, printed with “Mantra pending”.' },
  { id: 'mat', name: 'The Rest My Case Mat', price: 5800, img: 'assets/img/shop/mat.jpg', color: '#C3AEEF', line: 'For closing arguments with yourself.', detail: 'A 5mm natural rubber yoga mat in rose, with a carrying strap. “I rest my case” at the foot.', alt: 'A rose yoga mat, part-rolled, printed with “I rest my case”.' },
];

window.PLANS = [
  { id: 'reading', name: 'The Reading Room', monthly: 600, annual: 6000, line: 'More of the conversation.', perks: ['Bonus episodes and long versions', 'Abigail’s reading lists', 'No ads, ever', 'Early access to shop drops'] },
  { id: 'table', name: 'The Long Table', monthly: 1500, annual: 15000, line: 'Pull up a chair.', featured: true, perks: ['Everything in the Reading Room', 'The live Sunday circle', 'Ask questions for upcoming guests', '10% off everything in the shop'] },
];

window.MANTRAS = [
  'I am allowed to take up the whole morning.','I jumped once. I can jump again.','Today I will be curious before I am clever.','My life is not a conveyor belt.','I don’t need to earn my breakfast.','Soft is not the opposite of strong.','I will read the room, then redecorate it.','Enough is a place, and I am allowed to live there.','Today, I choose the interesting mistake.','I can love my life and still change it.','My body is home, not a project.','I rest my case. I also just rest.','Other women’s light does not dim mine.','I will wear the good earrings on a Tuesday.','Nobody ever flourished by being sensible all day.','I am a draft, and drafts are allowed to be messy.','I can say no, and I don’t have to write an essay about it.','Today I will notice one beautiful thing and tell someone.','I belong in every room I am curious about.','My joy needs no supporting evidence.','Slowly counts.','I’m not behind. There is no belt.','I will be kind to the woman in the mirror. She’s doing her best.','Today I’ll make something for no good reason.','Being loved is not a reward for being useful.','I will leave a little room for the day to surprise me.','My attention is precious, and I’m spending it on purpose.','I am somebody’s good news today.','Play is not the thing I do after the serious part.','Breathe in, shoulders down. The rest can wait a minute.',
];
