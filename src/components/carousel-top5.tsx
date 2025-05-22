import Carousel from "./carousel"

export default function CarouselTop5() {

  const images = [
    {
      src: "/img1.png",
      alt: "Image 1",
      // text: "Primeiro imóvel",
    },
    {
      src: "/img2.png",
      alt: "Image 2",
      // text: "Segundo imóvel",
    },
    {
      src: "/img3.png",
      alt: "Image 3",
      // text: "Terceiro imóvel",
    },
    {
      src: "/img4.png",
      alt: "Image 4",
      // text: "Quarto imóvel",
    },
    {
      src: "/img5.png",
      alt: "Image 5",
      // text: "Quinto imóvel",
    },
  ]

  return (
    <div style={{ backgroundColor: "#FFF3E0", padding: "20px", display: "flex", justifyContent: "center", marginTop: "20px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "1200px" }}>
      <Carousel images={images} />
      </div>
    </div>
  )
}

