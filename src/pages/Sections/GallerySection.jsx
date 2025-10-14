import RollingGallery from "../../components/Rbits/RollingGallery";
export default function GallerySection() {
  return (
    <div className="flex justify-center items-center h-screen flex-col">
      <div className="flex justify-center items-center flex-col">
        {/*TODO:Add Sparkling effect to the text */}
        <p className="font-bold text-7xl text-white block ml-20 mb-2">
          See What We Have done!!
        </p>
        <p className="font-normal text-lg text-slate-400 mt-4 ml-24  block mb-10">
          Get a Glimpse How exciting Our events Would be around
          <span className="text-blue-500"> India</span>.
        </p>
      </div>
      {/*Image Gallery -3 photo of Agra */}
      <div className=" w-screen self-center ">
        <RollingGallery autoplay={true} pauseOnHover={false} />
      </div>
    </div>
  );
}
