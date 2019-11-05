<template>
    <section class="columns is-vcentered">
        <div class="column is-5">
            <b-field label="Package" label-position="inside" custom-class="is-medium">
                <b-autocomplete
                    size="is-medium"
                    field="info.name"
                    placeholder="e.g. pandas"
                    :data="data"
                    :loading="isFetching"
                    :keep-first="true"
                    @focus.prevent="onFocusIn"
                    @blur.prevent="onFocusOut"
                    @select="onSelect"
                    @typing="getAsyncData"
                >
                    <template slot-scope="props">
                        <div class="media">
                            <!-- <div class="media-left">
                            <img
                                width="32"
                                :src="``"
                            />
                            </div>-->
                            <div class="media-content">
                                {{ props.option.info.name }}
                                <br />
                                <small>{{ props.option.info.summary | truncate(80) }}</small>
                            </div>
                        </div>
                    </template>
                </b-autocomplete>
            </b-field>
        </div>

        <div class="column is-1">
            <b-field custom-class="is-medium">
                <b-select placeholder="constraint">
                    <option value></option>
                    <option value="==">==</option>
                    <option value="~=">~=</option>
                    <option value=">=">&gt;=</option>
                    <option value="<=">&lt;=</option>
                    <option value=">">&gt;</option>
                    <option value="<">&lt;</option>
                </b-select>
            </b-field>
        </div>

        <div class="column is-3">
            <b-field label="Version" label-position="inside" custom-class="is-medium">
                <b-autocomplete
                    ref="versionInput"
                    size="is-medium"
                    field="release"
                    placeholder="*"
                    :data="releases"
                    :loading="isFetching"
                    :keep-first="true"
                    :open-on-focus="true"
                    @focus.prevent="onFocusIn"
                    @blur.prevent="onFocusOut"
                    @typing="onTyping"
                    @click.stop.prevent
                >
                    <template slot-scope="props">
                        <div class="media">
                            <div class="media-content">
                                {{ props.option.release }}
                                <br />
                                <span
                                    class="tag is-success"
                                >{{ new Date(props.option.data.upload_time).toLocaleDateString() }}</span>
                            </div>
                        </div>
                    </template>
                </b-autocomplete>
            </b-field>
        </div>

        <div class="column is-1 is-offset-1">
            <b-button icon-right="plus-circle-outline" size="is-medium" @click="onAddPackage" />
        </div>
    </section>
</template>

<script lang="ts">
import _ from "lodash";

import axios from "axios";
import debounce from "lodash/debounce";

import Vue from "vue";
import { mapMutations } from "vuex";

import Component from "vue-class-component";

import { PackageVersion } from "../../thoth";

// @ts-ignore
import Jupyter = require("base/js/namespace");

const BaseField = Vue.extend({
    props: {
        data: Array,

        selected: Object,
        placeholder: String,

        isFetching: Boolean
    }
});

@Component({
    filters: {
        /**
         * Filter to truncate string, accepts a length parameter
         */
        truncate(value: string, length: number) {
            if (_.isUndefined(value)) {
                return "";
            }
            return value.length > length
                ? value.substr(0, length) + "..."
                : value;
        }
    }
})
export default class PackageFinder extends BaseField {
    releaseFilter: string = ".*";

    get getAsyncData() {
        return debounce(name => {
            if (!name.length) {
                this.data = [];
                return;
            }
            this.isFetching = true;

            const url = `https://pypi.org/pypi/${name}/json`;
            axios
                .get(url)
                .then(({ data }) => {
                    this.data = [data];
                })
                .catch(error => {
                    this.data = [];
                    throw error;
                })
                // @ts-ignore
                .finally(() => {
                    this.isFetching = false;
                });
        }, 500);
    }

    get releases() {
        if (!this.selected) {
            return [];
        }
        const releases = Object.entries(this.selected.releases)
            .map(([k, d]: [string, any], i) => {
                return {
                    release: k,
                    data: d[0]
                };
            })
            .filter((d: any) => d.release.match(RegExp(this.releaseFilter)));

        releases.sort((a, b) => {
            const date_a = Date.parse(a.data.upload_time);
            const date_b = Date.parse(b.data.upload_time);

            if (date_a < date_b) return 1;
            else if (date_a > date_b) return -1;
            else return 0;
        });

        // matching most recent version
        releases.unshift({
            release: "*",
            data: { upload_time: new Date().toLocaleDateString() }
        });

        return releases;
    }

    get onTyping() {
        return debounce(value => {
            if (!value.length || value === "*") {
                this.releaseFilter = ".*";
            } else {
                this.releaseFilter = value;
            }
        }, 500);
    }

    onAddPackage() {}

    onSelect(option: any) {
        this.selected = option;
    }

    onFocusIn(event: Event) {
        event.stopPropagation();

        // disable keyboard manager
        Jupyter.notebook.keyboard_manager.disable();
    }

    onFocusOut() {
        // enable keyboard manager
        Jupyter.notebook.keyboard_manager.enable();
    }
}
</script>