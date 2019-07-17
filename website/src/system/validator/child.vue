<template>
    <form class="form-horizontal">
        <div class="form-group">
            <label class="col-sm-2 control-label">{{_('SSN')}}</label>
            <div class="col-sm-4">
                <input type="text" class="form-control" v-model="child.ssn" >
            </div>
        </div>

        <div class="form-group">
            <label class="col-sm-2 control-label">{{ _('Name')}}</label>
            <div class="col-sm-10">
                <hb-input-message v-model="child.firstName" :validator="validator" prop="child.firstName">
                    <input type="text" class="form-control" v-model="child.firstName" @input="updateName" placeholder="First name" style="width: 40%; display:inline;">
                </hb-input-message>
                <input type="text" class="form-control" v-model="child.middleName" @input="updateName" placeholder="Middle name" style="width: 18%; display:inline;">
                <hb-input-message v-model="child.lastName" :validator="validator" prop="child.lastName">
                    <input type="text" class="form-control" v-model="child.lastName" @input="updateName" placeholder="Last name" style="width: 40%; display:inline;">
                </hb-input-message>
            </div>
        </div>
        <div class="form-group">
            <label class="col-sm-2 control-label">{{ _('Fullname')}}</label>
            <div class="col-sm-10">
                <div class="input-group">
                    <input type="text" class="form-control" v-model="child.name" :disabled="!edit">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button" @click="edit=!edit"><i class="fas fa-pencil-alt"></i></button>
                    </span>
                </div>
            </div>
        </div>

        <div class="form-group">
            <label class="col-sm-2 control-label">{{_('Date of birth')}}</label>
            <div class="col-sm-4">
                <hb-input-date v-model="testDate2"></hb-input-date>
            </div>
            <div class="col-sm-6">
                <span>{{testDate2}}</span>
            </div>
        </div>


        <div class="form-group">
            <label class="col-sm-2 control-label">{{_('Date of birth')}}</label>
            <div class="col-sm-4">
                <hb-input-message v-model="child.dateOfBirth" :validator="validator" prop="child.dateOfBirth">
                    <el-date-picker type="date" v-model="child.dateOfBirth" style="width: 100%;" format="dd-MM-yyyy" value-format="yyyy-MM-dd" />
                </hb-input-message>
            </div>
            <div class="col-sm-6">
                <div class="checkbox">
                    <label>
                        <input type="checkbox"> {{ _('Expected date of birth')}}
                    </label>
                </div>
            </div>
        </div>

        <!--<div class="form-group">-->
            <!--<label class="col-sm-2 control-label">{{_('Date of birth')}}</label>-->
            <!--<div class="col-sm-4">-->
                <!--<hb-input-message v-model="child.dateOfBirth" :validator="validator" prop="child.dateOfBirth">-->
                    <!--<flat-pickr v-model="child.dateOfBirth" class="form-control" :config="{altInput: true, altFormat: 'd-m-Y', allowInput: true}" />-->
                <!--</hb-input-message>-->
            <!--</div>-->
            <!--<div class="col-sm-6">-->
                <!--<div class="checkbox">-->
                    <!--<label>-->
                        <!--<input type="checkbox"> {{ _('Expected date of birth')}}-->
                    <!--</label>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->

        <div class="form-group">
            <label class="col-sm-3 control-label">{{  _('Gender') }}</label>
            <div class="col-sm-9">
                <label class="radio-inline">
                    <input type="radio" value="O" v-model="child.gender"> {{ _('Unknown') }}
                </label>
                <label class="radio-inline">
                    <input type="radio" value="M" v-model="child.gender"> {{ _('Male') }}
                </label>
                <label class="radio-inline">
                    <input type="radio" value="F" v-model="child.gender"> {{ _('Female') }}
                </label>
            </div>
        </div>
        <div>{{child.firstName}}</div>
        <div>{{value.firstName}}</div>
    </form>
</template>

<script>
import {DatePicker, Select, Option} from 'element-ui'
import InputMessage from '../../../controls/hb-input-message'
import InputDate from '../../../controls/hb-date-input'
import validator from '../../../validators/validator/vue-mixin'
import throttle from 'throttle-debounce/throttle'
import debounce from 'throttle-debounce/debounce'

// import flatPickr from 'vue-flatpickr-component'
import {IMaskDirective} from 'vue-imask'
import IMask from 'imask'

import moment from '../../../controls/moment'

function defaultChild() {
    return {
        name: '',
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        ssn: '',
        gender: 'O'
    }
}

var momentFormat = _config_.format.dateShort;
var momentMask = {
    mask: Date,
    pattern: momentFormat,
    lazy: false,   // false, makes placeholder always visible
    placeholderChar: ' ',

    // min: new Date(1930, 0, 1),
    // max: new Date(2030, 0, 1),

    format: function (date) {
        return moment(date).format(momentFormat);
    },
    parse: function (str) {
        return moment(str, momentFormat);
    },

    groups: {
        YYYY: new IMask.MaskedPattern.Group.Range([1900, 2200]),
        MM: new IMask.MaskedPattern.Group.Range([1, 12]),
        DD: new IMask.MaskedPattern.Group.Range([1, 31])
    // HH: new IMask.MaskedPattern.Group.Range([0, 23]),
    // mm: new IMask.MaskedPattern.Group.Range([0, 59])
    }
}



export default {
    name: 'child',
    mixins: [validator],
    directives: {
        imask: IMaskDirective
    },
    props: {
        value: {
            type: Object,
            default: defaultChild()
        }
    },
    components: {
        'hb-input-message': InputMessage,
        'hb-input-date': InputDate,
        'el-date-picker': DatePicker,
        'el-select': Select,
        'el-option': Option,
    },

    data: function() {
        return {
            child: defaultChild(),
            edit: false,
            mask: momentMask,
            testDate: "25-02-1964",
            testDate2: new Date(1964, 1, 25),     // "1964-02-25",
            testDate3: "1964-02-25"
        }
    },
    mounted: function () {
        this.child.name = this.value.name
        this.child.firstName = this.value.firstName
        this.child.middleName = this.value.middleName
        this.child.lastName = this.value.lastName
        this.child.dateOfBirth = this.value.dateOfBirth
        this.child.ssn = this.value.ssn
        // this.display = this.format(this.value)
    },
    validators: {
        'child.firstName': {
            required : true,
            minLength: 4,
            custom: function(value) {
                // console.log(" custom validation: firstName")
                return [true, '']
            },
        },
        'child.lastName': {
            required: true,
            maxLength: 6,
            custom: function(value) {
                // console.log(" custom validation: lastName")
                return [value === 'Hart', 'Invalid last name']
            }
        // },
        // 'child.dateOfBirth': {
        //     required: true,
        //     date: true
        }
    },

    methods: {
        updateName: function() {
            var self = this
            if (self.child.middleName.length > 0) {
                self.child.name = self.child.firstName + ' ' + self.child.middleName + ' ' + self.child.lastName
            }
            else {
                self.child.name = self.child.firstName + ' ' + self.child.lastName
            }
        }
    },
    watch: {
        child: {
            handler: function(oldValue, newValue) {
                throttle(300, this.$emit('input', this.child))
            },
            deep: true
        }
    }

}
</script>

<style>

</style>
