'use client' ;
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, VideoIcon, Heart, DollarSign, FileText, LineChart } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#f6f6f9] text-[#333]">
      <main className="flex-1">
        <section className="w-full py-16 bg-[#e0f7fa]">
          <div className="container flex flex-col items-center px-6 mx-auto space-y-6 text-center">
            <h1 className="text-4xl font-bold text-[#00796b]">
              Empowering Your Health Journey
            </h1>
            <p className="text-lg text-[#004d40] max-w-xl">
              Book shared medical appointments with expert Lifestyle Medicine doctors, track your health progress, and communicate effortlessly on our innovative healthtech platform.
            </p>
            <div className="space-x-4">
              <Button className="bg-[#004d40] text-white">Book an Appointment</Button>
              <Button variant="outline">Learn More</Button>
            </div>
          </div>
        </section>

        <section className="w-full py-16">
          <div className="container px-6 mx-auto space-y-6 text-center">
            <h2 className="text-3xl font-bold text-[#00796b]">Features</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <VideoIcon className="w-10 h-10 mx-auto text-[#00796b]" />
                  <CardTitle>Telehealth Video Conferencing</CardTitle>
                  <CardDescription>Attend appointments from anywhere.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <DollarSign className="w-10 h-10 mx-auto text-[#00796b]" />
                  <CardTitle>Integrated Payment Processing</CardTitle>
                  <CardDescription>Secure and easy transactions.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <FileText className="w-10 h-10 mx-auto text-[#00796b]" />
                  <CardTitle>Electronic Health Records</CardTitle>
                  <CardDescription>All your records in one place.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <User className="w-10 h-10 mx-auto text-[#00796b]" />
                  <CardTitle>Personalized Dashboards</CardTitle>
                  <CardDescription>Track your health progress.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-[#e0f7fa]">
          <div className="container px-6 mx-auto space-y-6 text-center">
            <h2 className="text-3xl font-bold text-[#00796b]">Testimonials</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <Card className="hover:shadow-lg">
                <CardContent>
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <p className="mt-4 text-sm text-[#004d40]">"This platform has revolutionized my approach to managing diabetes. The shared appointments are incredibly motivating."</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg">
                <CardContent>
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" />
                    <AvatarFallback>SM</AvatarFallback>
                  </Avatar>
                  <p className="mt-4 text-sm text-[#004d40]">"Being able to track my progress and communicate directly with my doctor has been a game-changer."</p>
                </CardContent>
              </Card>
              <Card className="hover:shadow-lg">
                <CardContent>
                  <Avatar>
                    <AvatarImage src="https://picsum.photos/seed/picsum/200/300" />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                  <p className="mt-4 text-sm text-[#004d40]">"The accessibility and user-friendly interface make it easy to stay engaged with my health goals."</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16">
          <div className="container px-6 mx-auto space-y-6 text-center">
            <h2 className="text-3xl font-bold text-[#00796b]">Pricing Plans</h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Basic</CardTitle>
                  <CardDescription>$10/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-[#004d40]">
                    <li>Shared Appointments</li>
                    <li>Basic Telehealth</li>
                    <li>Email Support</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#004d40] text-white">Choose Plan</Button>
                </CardFooter>
              </Card>
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Standard</CardTitle>
                  <CardDescription>$20/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-[#004d40]">
                    <li>Shared Appointments</li>
                    <li>Advanced Telehealth</li>
                    <li>Dashboard Access</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#004d40] text-white">Choose Plan</Button>
                </CardFooter>
              </Card>
              <Card className="hover:shadow-lg">
                <CardHeader>
                  <CardTitle>Premium</CardTitle>
                  <CardDescription>$30/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="text-[#004d40]">
                    <li>All Features</li>
                    <li>24/7 Support</li>
                    <li>Exclusive Content</li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-[#004d40] text-white">Choose Plan</Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-[#e0f7fa]">
          <div className="container px-6 mx-auto space-y-6 text-center">
            <h2 className="text-3xl font-bold text-[#00796b]">Our Mission</h2>
            <p className="text-lg text-[#004d40] max-w-2xl mx-auto">
              We are dedicated to transforming healthcare by providing accessible, collaborative, and effective solutions to reverse chronic conditions and enhance the quality of life for all patients.
            </p>
          </div>
        </section>
      </main>
      <footer className="bg-[#00796b] p-6 text-white">
        <div className="container mx-auto">
          <div className="grid gap-8 grid-cols-2 sm:grid-cols-3 text-sm">
            <div>
              <h3 className="font-semibold">Company</h3>
              <ul>
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Resources</h3>
              <ul>
                <li>Blog</li>
                <li>Help Center</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold">Connect</h3>
              <ul>
                <li>LinkedIn</li>
                <li>Twitter</li>
                <li>Facebook</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;