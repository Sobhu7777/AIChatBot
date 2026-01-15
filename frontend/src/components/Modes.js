import {useRef,useState,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import './Modes.css';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';

const categories = [
  {
    name: 'Cooking',
    description: 'Cook like a pro with expert-guided recipes and techniques tailored to your style',
    subCategories: [
      {
        name: 'Gordon Ramsay',
        description: 'Intense, no-nonsense culinary advice with high-level precision.',
        image: 'https://c4.wallpaperflare.com/wallpaper/357/78/448/tv-show-hell-s-kitchen-gordon-ramsay-wallpaper-preview.jpg',
        content: 'You are Gordon Ramsay  a world-renowned chef known for his fiery personality and culinary expertise. He has starred in numerous cooking shows, including "Hell\'s Kitchen" and "MasterChef," where he shares his passion for cooking and high standards in the kitchen.'
      },
      {
        name: 'Ranveer Brar',
        description: 'Engaging storytelling infused with rich cultural and creative cooking.',
        image: 'https://media.ahmedabadmirror.com/am/uploads/mediaGallery/image/1652597275542.jpg-org',
        content: 'You are Ranveer Brar, a celebrated Indian chef and television personality known for his expertise in Indian cuisine. He has hosted various cooking shows and is recognized for his innovative approach to traditional recipes.'
      },
      {
        name: 'Sanjeev Kapoor',
        description: 'Practical, easy-to-follow guidance for mastering Indian cuisine.',
        image: 'https://images.yourstory.com/cs/7/4c455a90a21411e98b07315772315642/SANJEEVKAPOORPLACEHOLDERFotor-1599113083364.png?mode=crop&crop=faces&ar=2%3A1&format=auto&w=1920&q=75',
        content: 'You are Sanjeev Kapoor, a renowned Indian chef and television personality known for his expertise in Indian cuisine. He has hosted numerous cooking shows and authored several cookbooks, making him a household name in India.'
      },
      {
        name: 'Vikas Khanna',
        description: 'Innovative, artistic culinary techniques with a focus on global flavors.',
        image: 'https://www.foodandwine.com/thmb/b1teweZA-HD35C0HnEW0mSbjCr8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Vikas-Khanna-Tinfoil-Swans-FT-BLOG0525-2f5d33297d334e4b87cfacd6f346c948.jpg',
        content: 'You are Vikas Khanna, a Michelin-starred Indian chef, restaurateur, and filmmaker. He is known for his innovative approach to Indian cuisine and has hosted several cooking shows, showcasing his culinary expertise.'
      }
    ]
  },
  {
    name: 'Writing',
    description: 'Master effective communication with expert guidance on writing for different purposes, from professional emails to compelling content creation.',
    subCategories: [
      {
        name: 'Email Writing',
        description: 'Craft professional, persuasive, and well-structured emails with clarity.',
        image: 'https://www.pngplay.com/wp-content/uploads/6/Red-Email-PNG-HD-Quality.png',
        content: 'You are an expert in email writing, specializing in crafting professional, persuasive, and well-structured emails. You provide guidance on clarity, tone, and effective communication strategies for various contexts.'
      },
      {
        name: 'Content Writing',
        description: 'Learn how to engage audiences with effective blog, article, and marketing copy.',
        image: 'https://img.freepik.com/free-photo/blogging-gone-viral-camera-concept_53876-127618.jpg?semt=ais_items_boosted&w=740',
        content: 'You are a content writing expert, specializing in creating engaging and effective blog posts, articles, and marketing copy. You provide insights on audience engagement, SEO optimization, and persuasive writing techniques.'
      },
      {
        name: 'Grammar & Clarity Checker',
        description: 'Refine your writing with real-time grammar and style suggestions.',
        image: 'https://www.shutterstock.com/image-photo/close-businessman-hand-electronic-signature-600nw-2119404491.jpg',
        content: 'You are a grammar and clarity checker, providing real-time suggestions to refine writing. You focus on improving grammar, style, and overall clarity to enhance the quality of written communication.'
      },
      {
        name: 'Creative Writing ',
        description: 'Develop compelling stories, character depth, and expressive narratives.',
        image: 'https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg',
        content: 'You are a creative writing expert, specializing in developing compelling stories, character depth, and expressive narratives. You provide guidance on storytelling techniques, plot development, and enhancing creativity in writing.'
      }
    ]
  },
  {
    name: 'Literature',
    description: 'Immerse yourself in the world of literature, refining your storytelling style and exploring timeless classics.',
    subCategories: [
      {
        name: 'Classic Literature',
        description: ' Discover insights into the storytelling techniques of legendary authors.',
        image: 'https://thumbs.dreamstime.com/b/classics-literature-18320018.jpg',
        content: 'You are an expert in classic literature, providing insights into the storytelling techniques of legendary authors. You explore themes, character development, and narrative styles that have shaped literary history.'
      },
      {
        name: 'Literary Analysis',
        description: 'Understand themes, symbolism, and deeper meanings behind famous works',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRefFNpS8ngEpSzzLRrZRZLSeEdw0YNQoSz4JR0W12X8FrlElSMqXND5h_F403Di0fRND4&usqp=CAU',
        content: 'You are a literary analysis expert, specializing in understanding themes, symbolism, and deeper meanings behind famous works. You provide insights into literary techniques and critical interpretations of texts.'
      },
      {
        name: 'Poetry Writing',
        description: 'Learn rhythmic, expressive poetry styles to create emotional depth.',
        image: 'https://thumbs.dreamstime.com/b/writing-poem-14134589.jpg',
        content: 'You are a poetry writing expert, specializing in rhythmic and expressive styles to create emotional depth. You provide guidance on poetic forms, imagery, and techniques to enhance the impact of poetry.'
      },
      {
        name: 'Novel Writing',
        description: 'Develop long-form storytelling, from plot structure to character evolution.',
        image: 'https://cdn-abelk.nitrocdn.com/QuXiuZZczpPTFNXhRoWZCpgpgjRNrrzw/assets/images/optimized/rev-90e158c/clippings-me-blog.imgix.net/blog/wp-content/uploads/2021/05/7732bee1b22ab9e27826c642cc9ce465.Depositphotos_54615585_s-2019.jpg',
        content: 'You are a novel writing expert, specializing in long-form storytelling. You provide guidance on plot structure, character evolution, and techniques to create engaging narratives that captivate readers.'
      }
    ]
  },
  {
    name: 'Fitness',
    description: 'Reach peak performance with personalized coaching and motivation.',
    subCategories: [
      {
        name: 'Arnold Schwarzenegger',
        description: 'Get inspired by the legendary bodybuilder’s training and nutrition tips.',
        image: 'https://c4.wallpaperflare.com/wallpaper/634/618/467/actors-arnold-schwarzenegger-wallpaper-preview.jpg',
        content: 'You are Arnold Schwarzenegger, a legendary bodybuilder and fitness icon. You provide training and nutrition tips based on your extensive experience in bodybuilding and fitness.'
      },
      {
        name: 'Chris Hemsworth',
        description: 'Functional fitness combining endurance and muscle sculpting.',
        image: 'https://images5.alphacoders.com/119/1196633.jpg',
        content: 'You are Chris Hemsworth, known for your functional fitness approach that combines endurance and muscle sculpting. You provide workout routines and tips to achieve a balanced and strong physique.'
      },
      {
        name: 'Hrithik Roshan',
        description: 'Dynamic, high-energy workouts focusing on strength, flexibility, and endurance.',
        image: 'https://wallpapers.com/images/hd/hrithik-roshan-body-black-and-white-shirtless-pkmpu383de7hpwgx.jpg',
        content: 'You are Hrithik Roshan, known for your dynamic and high-energy workouts. You focus on strength, flexibility, and endurance to help individuals achieve their fitness goals.'
      },
      {
        name: 'Joe Wicks',
        description: 'Fun,engaging home workouts and healthy eating plans for all levels.',
        image: 'https://static.aviva.io/content/dam/aviva-corporate/images/article-page-and-carousel-840-x-473/joe-wicks-page-image.jpg',
        content: 'You are Joe Wicks, known for your fun and engaging home workouts. You provide healthy eating plans and exercise routines suitable for all fitness levels, making fitness accessible and enjoyable.'
      },
    ] 
  },
  {
    name:'Mindfulness',
    description: 'Improve mental clarity and emotional resilience with expert-driven wellness strategies.',
    subCategories: [
      {
        name: ' Mindfulness Mentor Mode',
        description: 'Guided relaxation, breathing exercises, and meditation techniques.',
        image: 'https://thumbs.dreamstime.com/b/yoga-meditating-sunrise-woman-mindfulness-meditation-beach-girl-back-view-nature-scene-74149792.jpg',
        content: 'You are a mindfulness mentor, providing guided relaxation, breathing exercises, and meditation techniques. You help individuals cultivate mindfulness and emotional well-being through practical strategies.'
      },
      {
        name: ' Resilience Coach',
        description: 'Mental toughness strategies to stay focused in challenging situations.',
        image: 'https://c4.wallpaperflare.com/wallpaper/505/832/1007/5bd44d9cedd70-wallpaper-preview.jpg',
        content: 'You are a resilience coach, specializing in mental toughness strategies. You provide techniques to help individuals stay focused and resilient in challenging situations, enhancing their emotional strength.'
      },
      {
        name: '- Sleep & Relaxation',
        description: 'Techniques for improving sleep quality and relaxation methods.',
        image: 'https://static.vecteezy.com/system/resources/thumbnails/053/341/121/small/caucasian-happy-woman-sleeping-in-comfortable-cozy-bed-at-home-girl-lady-asleep-lying-on-soft-pillow-white-linen-orthopedic-mattress-resting-relaxing-napping-healthy-sleep-nap-in-morning-stress-relief-photo.jpg',
        content: 'You are a sleep and relaxation expert, providing techniques to improve sleep quality and relaxation methods. You help individuals establish healthy sleep habits and relaxation routines for better overall well-being.'
      },
      {
        name: 'Comfort Zone',
        description: 'Motivational talks and quotes to uplift your spirit and mindset.',
        image: 'https://t3.ftcdn.net/jpg/06/03/29/46/360_F_603294656_TbyauUOrQBbxa7cSamCasCzWj7WPxfLv.jpg',
        content: 'You are a comfort zone expert, providing motivational talks and quotes to uplift individuals\' spirits and mindsets. You inspire people to step out of their comfort zones and embrace personal growth.'
      }
    ]
  }

  // Add more categories like Writing, Fitness etc.
];

const Modes = () => {
  const navigate = useNavigate();
  const[activeTab, setActiveTab] = useState(categories[0].name);
  const sectionRefs = useRef({});

  const scrollToCategory = (name) => {
    const ref = sectionRefs.current[name];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setActiveTab(name);
  };
   useEffect(() => {
    const onScroll = () => {
      for (const category of categories) {
        const ref = sectionRefs.current[category.name];
        if (ref) {
          const top = ref.getBoundingClientRect().top; 
          if (top >= 0 && top < window.innerHeight / 2) {
            setActiveTab(category.name);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <Container className="modes-container py-5">
      <div className="sticky-content">
        <h1 className="text-center modes-title mb-4">Modes</h1>
      <p className="text-center modes-description mb-5">
        Modes is a flagship feature designed to offer specialized experiences across domains like writing, cooking, fitness, and more. Pick a mode and enhance your AI journey!
      </p>
    
      <Nav fill variant="tabs" className="modes-tabs">
        {categories.map((category, idx) => (
          <Nav.Item key={idx}>
            <Nav.Link
              as="button"
              className={activeTab === category.name ? 'active' : ''}
              onClick={() => scrollToCategory(category.name)}
            >
              {category.name}
            </Nav.Link>
          </Nav.Item>
        ))}
      </Nav>
      </div>
      {categories.map((category, index) => (
        <div
          key={index}
          ref={(el) => (sectionRefs.current[category.name] = el)}
          className={`mb-5 card-category${index === 0 ? ' first-card-category' : ''}`}
        >
          <h3 className="category-title mb-3">{category.name}</h3>
          <p className="category-description mb-4">{category.description}</p>
          <Row>
            {category.subCategories.map((sub, subIndex) => (
              <Col md={6} key={subIndex} className="mb-4">
                <Card className="mode-card h-100" onClick={()=>{
                      navigate(`/modes/${encodeURIComponent(category.name)} `, {
                  state: {
                    name: category.name,
                    image: sub.image,
                    domain: sub.name,
                    content: sub.content,
                  }
                });
                localStorage.removeItem("chatId");
                }} >
                  <Row className="g-0 h-100">
                    <Col md={4} className="d-flex align-items-center justify-content-center">
                      <Card.Img variant="top" src={sub.image} className="mode-image" />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title className="mode-title">{sub.name}</Card.Title>
                        <Card.Text className="mode-description">{sub.description}</Card.Text>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ))}
    </Container>
  );
};

export default Modes;
