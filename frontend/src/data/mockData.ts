import { SearchResult, FilterGroup } from '../types';

export const mockResults: SearchResult[] = [
  {
    doc_id: "54327",
    text: "The WP.SE community has always advised the use of `wp_register_script` and `wp_enqueue_script` for adding scripts in a theme/template (and likewise, `wp_register_style` and `wp_enqueue_style` for stylesheets). This is how I register and enqueue my scripts... First, I add something like this in functions.php add_action('init','wpse54189_register_script'); function wpse54189_register_script(){ //Register scripts wp_enqueue_script( 'jquery' ); wp_register_script( 'aahan_bootstrap_transition', get_template_directory_uri().'/js/bootstrap-transition.js'); wp_register_script( 'aahan_bootstrap_carousel', get_template_directory_uri().'/js/bootstrap-carousel.js', array('aahan_bootstrap_transition')); wp_register_script( 'wpse54189_ajax_comment', get_template_directory_uri().'/js/no-reload-comments.js'); } then call it in a template file (say, header.php) like this <?php wp_enqueue_script( 'aahan_bootstrap_carousel' ); ?> <?php wp_enqueue_script( 'wpse54189_ajax_comment' ); ?> Now, coming to the point, how do I register and enqueue conditional JavaScript files that are there to be recognized by specific browsers?",
    title: "Register and enqueue conditional (browser-specific) javascript files?",
    tags: ["javascript", "wp-enqueue-script", "wp-register-script"],
    promedio: 0.8769473442792952
  },
  {
    doc_id: "12345",
    text: "When working with WordPress themes, it's important to properly enqueue scripts and styles. The wp_enqueue_script() function is the recommended way to add JavaScript files to your theme. This function ensures that scripts are loaded in the correct order and prevents conflicts between different scripts.",
    title: "Best practices for WordPress script enqueuing",
    tags: ["wordpress", "javascript", "best-practices"],
    promedio: 0.7234567890123456
  },
  {
    doc_id: "67890",
    text: "CSS preprocessing with SASS and LESS has become an essential part of modern web development. These tools allow developers to write more maintainable and organized stylesheets by providing features like variables, mixins, and nested rules.",
    title: "Introduction to CSS Preprocessing",
    tags: ["css", "sass", "less", "preprocessing"],
    promedio: 0.6543210987654321
  }
];

export const filterGroups: FilterGroup[] = [
  {
    id: 'metrica',
    name: 'Modelo de Búsqueda',
    options: [
      { id: 'metrica-promedio', label: 'Promedio', value: 'promedio' },
      { id: 'metrica-tfidf', label: 'TF-IDF', value: 'tfidf' },
      { id: 'metrica-bm25', label: 'BM25', value: 'bm25' },
    ]
  }
];