import RiderNavbar from "@/components/RiderNavbar";
import RideBookingCard from "@/components/RideBookingCard";
import RecentRides from "@/components/RecentRides";
import MapSection from "@/components/MapSection";



export default function RiderPage() {
  return (
    <div className="flex flex-column  justify-center min-h-screen p-10">
      <RiderNavbar/>
      <RideBookingCard/>
      <MapSection/>
      <RecentRides/>

    </div>
  )
}