import { BookUserIcon , BadgeCheck,X} from 'lucide-react'
import React from 'react'
import Title from './Title'

const Testimonials = () => {

     const cardsData = [
        {
            image: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200',
            name: 'Briar Martin',
            handle: '@neilstellar',
            date: 'April 20, 2025'
        },
        {
            image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
            name: 'Avery Johnson',
            handle: '@averywrites',
            date: 'May 10, 2025'
        },
        {
            image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60',
            name: 'Jordan Lee',
            handle: '@jordantalks',
            date: 'June 5, 2025'
        },
        {
            image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60',
            name: 'Avery Johnson',
            handle: '@averywrites',
            date: 'May 10, 2025'
        },
    ];

    const CreateCard = ({ card }) => (
  <div className="p-4 rounded-lg mx-4 shadow hover:shadow-lg transition-all duration-200 w-72 shrink-0 bg-white border border-slate-200">
    <div className="flex gap-2">
      <img
        className="size-11 rounded-full"
        src={card.image}
        alt={card.name}
      />

      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <p className="font-medium text-slate-900">{card.name}</p>
          <BadgeCheck className="size-3 text-blue-500 mt-0.5" />
        </div>

        <span className="text-xs text-slate-500">{card.handle}</span>
      </div>
    </div>

    <p className="text-sm py-4 text-slate-700">
      ResumeApt helped me tailor my resume perfectly for each role. Highly recommended!
    </p>

    <div className="flex items-center justify-between text-slate-500 text-xs">
  <div className="flex items-center gap-1">
    <span>Posted on</span>
    <a
      href="https://x.com"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-blue-500 transition"
    >
      <X className="size-3 text-slate-400 hover:text-blue-600 transition" />
    </a>
  </div>
  <p>{card.date}</p>
</div>
  </div>
);




  return (
    <>
    <div id="testimonials" className=" flex flex-col items-center my-10 scroll-mt-12">
        <div className="flex items-center gap-2 text-sm text-blue-600
        bg-blue-400/10 rounded-full px-6 py-1.5">
            <BookUserIcon className="size-4.5 stroke-blue-600"/>
            <span>Testimonials</span>
        </div>
        <Title title="Don't just take our word for it" description="Hear from our satisfied users who have transformed their job search with ResumeApt.
         We're always looking for ways to improve.If you have a positive experience with us,leave a review."/>
        </div>

         <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                <div className="marquee-inner flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>

            <div className="marquee-row w-full mx-auto max-w-5xl overflow-hidden relative">
                <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent"></div>
                <div className="marquee-inner marquee-reverse flex transform-gpu min-w-[200%] pt-10 pb-5">
                    {[...cardsData, ...cardsData].map((card, index) => (
                        <CreateCard key={index} card={card} />
                    ))}
                </div>
                <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent"></div>
            </div>
 

            <style>{`
            @keyframes marqueeScroll {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }

            .marquee-inner {
                animation: marqueeScroll 25s linear infinite;
            }

            .marquee-reverse {
                animation-direction: reverse;
            }
        `}</style>


        </>
  )
}

export default Testimonials