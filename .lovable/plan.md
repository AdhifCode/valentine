
# 💕 Valentine's Day Interactive Website

## Overview
Website Valentine yang sangat interaktif, romantis, dan responsif dengan animasi GSAP, parallax effects, dan berbagai elemen surprise.

## Design & Estetika
- **Warna**: Soft Pink (#FDE2E4), Putih, Emas (#D4A574), Merah Marun (#800020)
- **Font**: Playfair Display (Serif) untuk judul, Inter (Sans-Serif) untuk body text
- **Nuansa**: Dreamy, clean, modern dengan gradien lembut dan efek floating hearts di background

## Fitur yang Akan Dibangun

### 1. Hero Section dengan Parallax
- Background dengan efek parallax mengikuti gerakan mouse (GSAP)
- Judul besar "Happy Valentine's Day" dengan animasi text reveal yang elegan
- Floating hearts/particles di background
- Smooth scroll indicator di bagian bawah

### 2. Scroll Reveal Love Letter
- Surat cinta yang muncul baris demi baris saat di-scroll
- Menggunakan GSAP ScrollTrigger untuk efek fade-in dramatis per paragraf
- Teks di-hardcode dalam array JavaScript agar mudah diedit
- Efek typewriter atau handwriting feel

### 3. Interactive Photo Gallery — "Memory Lane"
- Carousel/swipeable gallery untuk 12+ foto placeholder
- Efek zoom saat hover dan tilt 3D saat diklik
- Lightbox view untuk melihat foto lebih besar
- Caption di setiap foto (hardcoded, mudah diganti)
- Smooth transitions antar foto dengan GSAP

### 4. Surprise Element — Tombol Lari-lari + Hujan Hati & Confetti
- Tombol "Click Me 💕" yang kabur/menghindar saat mouse mendekati
- Setelah beberapa kali mencoba, tombol akhirnya bisa diklik
- Saat diklik: animasi hujan hati + confetti particles memenuhi layar
- Pesan rahasia muncul setelah confetti

### 5. Audio Player Minimalis
- Floating music player di pojok layar
- Auto-play dengan opsi mute/unmute
- Desain minimalis dengan ikon musik dan animasi equalizer
- Placeholder untuk file audio (mudah diganti URL-nya)

### 6. Footer Romantis
- Pesan penutup dengan animasi fade-in
- Countdown atau tanggal spesial
- Animated heart pulse

## Data Structure
Semua teks ucapan, URL foto, dan konfigurasi akan di-hardcode dalam file data terpisah (`src/data/valentineData.ts`) agar mudah diedit tanpa menyentuh komponen.

## Responsivitas
- Desktop: Layout penuh dengan semua efek parallax dan hover
- Tablet: Layout disesuaikan, efek tetap aktif
- Mobile: Touch-friendly carousel, tap untuk interaksi, layout single-column
