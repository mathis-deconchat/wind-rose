import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  template: `
    <div class="min-h-screen flex flex-col items-center justify-center p-4">
      <div class="max-w-4xl w-full space-y-8">
        <div class="text-center">
          <h1 class="text-5xl font-bold text-indigo-400 mb-4">Welcome to Our App</h1>
          <p class="text-xl text-gray-400">A modern Angular application with a dark theme</p>
        </div>
        
        <div class="bg-gray-800 rounded-lg shadow-xl p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-4">
              <div class="bg-gray-700 p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-indigo-300">Feature One</h3>
                <p class="text-gray-300">Experience the power of modern web development</p>
              </div>
              <div class="bg-gray-700 p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-indigo-300">Feature Two</h3>
                <p class="text-gray-300">Built with Angular and Tailwind CSS</p>
              </div>
            </div>
            <div class="space-y-4">
              <div class="bg-gray-700 p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-indigo-300">Feature Three</h3>
                <p class="text-gray-300">Responsive and mobile-friendly design</p>
              </div>
              <div class="bg-gray-700 p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-indigo-300">Feature Four</h3>
                <p class="text-gray-300">Dark theme for comfortable viewing</p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-full transition duration-300">
            Get Started
          </button>
        </div>
      </div>
    </div>
  `,
})
export class HomeComponent {}