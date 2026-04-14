import { ArrowRightIcon, AcademicCapIcon, UsersIcon, TrophyIcon, CalendarDaysIcon, MapPinIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  const programs = [
    {
      icon: TrophyIcon,
      title: 'Competitive Training',
      description: 'Professional coaching and competitive training programs for all skill levels.'
    },
    {
      icon: UsersIcon,
      title: 'Community Events',
      description: 'Regular tournaments, matches, and social events to build community.'
    },
    {
      icon: AcademicCapIcon,
      title: 'Youth Development',
      description: 'Programs dedicated to developing young talent and passion for sports.'
    },
    {
      icon: CalendarDaysIcon,
      title: 'Training Schedule',
      description: 'Training schedules available at multiple times.'
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header/Navigation */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Tri Dharma Logo"
              width={40}
              height={40}
            />
            <span className="text-xl font-semibold text-slate-900">Tri Dharma Basketball</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#programs" className="text-sm font-medium text-slate-600 hover:text-slate-900">
              Programs
            </a>
            <a href="#contact" className="rounded-lg px-4 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800">
              Join Us
            </a>
            <a href="/login" className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors bg-primary-50 px-4 py-2 rounded-lg">
              Log in
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="flex flex-col justify-center">
              <h1 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                Welcome to Tri Dharma
              </h1>
              <p className="mt-6 text-xl text-slate-600">
                A leading basketball club dedicated to fostering athletic excellence, community spirit, and personal growth through basketball.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="#contact"
                  className="group flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  Join Our Club
                  <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#about"
                  className="rounded-lg border border-slate-300 px-8 py-3 font-medium text-slate-900 transition-colors hover:bg-slate-50"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8">
                <div className="aspect-video bg-gradient-to-br from-blue-200 to-blue-100 rounded-lg flex items-center justify-center">
                  {/* <TrophyIcon className="h-24 w-24 text-blue-300" /> */}
                  <Image
                    src="/tri-dharma-juara.jpg"
                    alt="Tri Dharma Champions"
                    width={400}
                    height={300}
                    className="rounded-lg object-cover"
                  />
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-48 h-48 bg-gradient-to-br from-blue-200 to-blue-100 rounded-xl opacity-50 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-16 sm:py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="bg-gradient-to-br from-slate-200 to-slate-100 rounded-2xl p-8 aspect-video flex items-center justify-center">
              {/* <UsersIcon className="h-32 w-32 text-slate-300" /> */}
              {/* // Add images */}
              <Image
                src="/tri-dharma-juara.jpg"
                alt="About Tri Dharma"
                width={400}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                About Tri Dharma
              </h2>
              <p className="mt-6 text-lg text-slate-600">
                Tri Dharma Basketball is a leading basketball club. With locations in Surabaya and Sidoarjo.
              </p>
              <p className="mt-4 text-lg text-slate-600">
                Our mission is to promote athletic excellence, build a strong community of basketball enthusiasts, and provide world-class facilities and coaching to players of all ages and skill levels.
              </p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-3 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Professional coaches and trainers
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  State-of-the-art facilities
                </li>
                <li className="flex items-center gap-3 text-slate-600">
                  <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                  Community-focused events
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Our Programs
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Comprehensive programs designed for athletes of all levels and ages
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 p-8 transition-all hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100 bg-white"
                >
                  <Icon className="h-8 w-8 text-blue-600" />
                  <h3 className="mt-4 text-lg font-semibold text-slate-900">
                    {program.title}
                  </h3>
                  <p className="mt-2 text-slate-600">
                    {program.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-16 sm:py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold sm:text-4xl text-center">
            Our Locations
          </h2>
          
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div className="rounded-xl bg-slate-800/50 backdrop-blur p-8 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <MapPinIcon className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold">Sidoarjo</h3>
              </div>
              <p className="text-slate-300">
                Jalan Hang Tua No 32, Sidoarjo<br/>
                East Java, Indonesia
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Instagram<br/>
                @tri.dharma.sidoarjo
              </p>
            </div>

            <div className="rounded-xl bg-slate-800/50 backdrop-blur p-8 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <MapPinIcon className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold">Surabaya</h3>
              </div>
              <p className="text-slate-300">
                Jalan Hang Tua No 32, Sidoarjo<br/>
                East Java, Indonesia
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Instagram:<br/>
                @tridharmabasketballsby
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Join Tri Dharma Today
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Get in touch with us to learn about membership options and start your athletic journey
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-12 border border-slate-200">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Phone</p>
                  <p className="text-lg font-medium text-slate-900">082132386673</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Instagram</p>
                  <p className="text-lg font-medium text-slate-900">tri.dharma.sidoarjo / tridharmabasketballsby</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <MapPinIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Visit Us</p>
                  <p className="text-lg font-medium text-slate-900">Sidoarjo Locations</p>
                </div>
              </div>
            </div>

            <button className="mt-8 w-full rounded-lg bg-blue-600 px-8 py-3 font-medium text-white transition-all hover:bg-blue-700">
              Send Inquiry
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 sm:grid-cols-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/logo.png"
                  alt="Tri Dharma Logo"
                  width={32}
                  height={32}
                />
                <span className="font-semibold text-slate-900">Tri Dharma</span>
              </div>
              <p className="text-sm text-slate-600">
                Leading basketball club in Surabaya and Sidoarjo
              </p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">Quick Links</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#about" className="hover:text-slate-900">About</a></li>
                <li><a href="#programs" className="hover:text-slate-900">Programs</a></li>
                <li><a href="#contact" className="hover:text-slate-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">Locations</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>Surabaya</li>
                <li>Sidoarjo</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-slate-900 mb-3">Contact</p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li>082132386673</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-slate-500">
              © 2026 Tri Dharma Basketball. All rights reserved.
            </p>
            <div className="flex gap-4 text-sm text-slate-500">
              <a href="#" className="hover:text-slate-900">Privacy Policy</a>
              <a href="#" className="hover:text-slate-900">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
