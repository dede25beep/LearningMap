import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = 'https://zzxignsbakvesqbgcqhu.supabase.co'
const supabaseKey = 'SUA_PUBLISHABLE_KEY_AQUI'

const supabase = createClient(supabaseUrl, supabaseKey)

document.addEventListener("DOMContentLoaded", function () {
  const navLinks = document.querySelectorAll(".sidebar a");

  navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");       
      const targetSection = document.querySelector(targetId);

   
      document.querySelectorAll("section[id]").forEach(section => {
        section.style.display = "none";
      });

    
      if (targetSection) {
        targetSection.style.display = "block";
        targetSection.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});

