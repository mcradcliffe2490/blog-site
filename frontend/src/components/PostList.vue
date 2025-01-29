<!--This component should be reusable so as to take in some parameters and
    then render a viewable post list in ordering based on parameters given to it.
    As a result, this component must do several things:
      - get a stored list of posts and that post data from somewhere
      - store the summary of that post in another structure to be used elsewhere
      - iterate over that list of post and display post
      - if hovering over a blog post, get that blog posts info and display a summary
-->

<script lang="ts">

defineProps({
  ordering: {
    type: String,
    default: 'date'
  },
  ascending: {
    type: Boolean,
    default: true
  }
})
</script>
