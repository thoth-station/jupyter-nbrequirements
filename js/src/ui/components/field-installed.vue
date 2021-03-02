<template>
    <section>
        <b-tooltip v-if="version" position="is-right" :label="'Installed: ' + version" :delay="100">
            <span class="tag is-success" style="font-size: 0.9em;">
                <b-icon icon="check" size="is-small"></b-icon>
            </span>
        </b-tooltip>
        <b-tooltip v-else position="is-right" label="Package is NOT installed" :delay="100">
            <span class="tag is-danger" style="font-size: 0.9em;">
                <b-icon icon="close" size="is-small"></b-icon>
            </span>
        </b-tooltip>
    </section>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";

@Component({
    props: {
        version: String
    }
})
export default class InstalledField extends Vue {}
</script>
