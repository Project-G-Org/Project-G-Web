/**
 * @author Gabriel Spinola Mendes da Silva | gabrielspinola77@gmail.com
 * @author Lucas Vinicius Pereira Martis | lucasvinipessoal@gmail.com
 *
 * @project Project G
 * @version main-release
 * @license i.e. MIT
 */

import ExploreSearchBar from './components/FindObject'
import CarouselItems from './components/Carousel'
import Image from 'next/image'
import ExploreGrid from './components/ExploreGrid'

export default function ExplorePage() {
  return (
    <main className="mt-[88px] flex flex-col align-top bg-darker-white justify-center items-center">
      {/* NOTE - Upper Section of page */}
      <section className="relative h-[95vh] w-[100%] first-letter:items-center">
        {/* NOTE - Background of Upper Section */}
        <Image
          src={'/assets/explore/photo-1619615713569-fe374aad7185.jpg'}
          alt=""
          fill
          style={{ objectFit: 'cover' }}
          className="brightness-[25%]"
        />
        {/* NOTE - Upper Section Content Container */}
        <div className="absolute w-full z-[1] flex flex-col gap-32 my-24">
          {/* NOTE - Upper Sction Text and SeachBar */}
          <ExploreSearchBar />
          {/* NOTE - Upper Seection Carousl */}
          <CarouselItems />
        </div>
      </section>

      <ExploreGrid />
    </main>
  )
}
