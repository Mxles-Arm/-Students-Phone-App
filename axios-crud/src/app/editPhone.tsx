import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FormActions, SectionPicker, TextField } from '../components/form-controls';
import { spacing, ThemeColors, typography, useTheme } from '../theme';
import api from '../utils/crud-api';

type Errors = {
    name?: string;
    sect?: string;
    tel?: string;
};

const EditPhone = () => {
    const { id, name, sect, tel } = useLocalSearchParams<{
        id: string;
        name: string;
        sect: string;
        tel: string;
    }>();
    const { colors } = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const [newName, setNewName] = useState(name);
    const [newSect, setNewSect] = useState(sect);
    const [newTel, setNewTel] = useState(tel);
    const [errors, setErrors] = useState<Errors>({});
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const validate = () => {
        const next: Errors = {};
        if (newName.trim() === '') next.name = 'Name is required';
        if (newSect === '') next.sect = 'Please choose a section';
        if (newTel.trim() === '') next.tel = 'Phone number is required';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const updatePhone = async () => {
        if (!validate()) return;

        setSaving(true);
        try {
            await api.put('phones/' + id, {
                name: newName.trim(),
                sect: newSect,
                tel: newTel.trim(),
            });
            router.navigate('/');
        } catch (err) {
            console.log(err);
            Alert.alert('Update failed', 'Could not save your changes. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Update Information</Text>
                        <Text style={styles.subtitle}>
                            Editing the contact for {name}.
                        </Text>
                    </View>

                    <View style={styles.card}>
                        <TextField
                            label="Name"
                            value={newName}
                            onChangeText={(text) => {
                                setNewName(text);
                                if (errors.name) setErrors((e) => ({ ...e, name: undefined }));
                            }}
                            placeholder="e.g. John Doe"
                            error={errors.name}
                            autoCapitalize="words"
                        />

                        <SectionPicker
                            value={newSect}
                            onChange={(value) => {
                                setNewSect(value);
                                if (errors.sect) setErrors((e) => ({ ...e, sect: undefined }));
                            }}
                            error={errors.sect}
                        />

                        <TextField
                            label="Phone number"
                            value={newTel}
                            onChangeText={(text) => {
                                setNewTel(text);
                                if (errors.tel) setErrors((e) => ({ ...e, tel: undefined }));
                            }}
                            placeholder="e.g. 084-965-4528"
                            error={errors.tel}
                            keyboardType="phone-pad"
                        />
                    </View>
                </ScrollView>

                <FormActions
                    onCancel={() => router.back()}
                    onSubmit={updatePhone}
                    submitLabel="Save Changes"
                    submitting={saving}
                />
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default EditPhone;

function makeStyles(colors: ThemeColors) {
    return StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    flex: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        gap: spacing.xs,
        marginBottom: spacing.xl,
    },
    title: {
        ...typography.title,
        color: colors.text,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textMuted,
    },
    card: {
        gap: spacing.lg,
    },
    });
}
