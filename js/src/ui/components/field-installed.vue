<template>
    <section>
        <span v-if="installed === true" class="tag is-success" style="font-size: 0.9em;">
            <b-icon icon="check" size="is-small"></b-icon>
        </span>
        <span v-else-if="installed === false" class="tag is-danger" style="font-size: 0.9em;">
            <b-icon icon="close" size="is-small"></b-icon>
        </span>
        <span v-else class="tag" style="font-size: 0.9em;">
            ?
        </span>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    props: {
        installed: Boolean
    }
})
export default class InstalledField extends Vue {}
</script>